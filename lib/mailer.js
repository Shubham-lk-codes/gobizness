const nodemailer = require('nodemailer');

let transporter;
let transporterKey;
let verificationPromise;

function getSmtpDiagnostics() {
    const smtpPort = process.env.SMTP_PORT?.trim();
    const smtpSecure = process.env.SMTP_SECURE?.trim();

    return {
        host: process.env.SMTP_HOST?.trim() || 'missing',
        port: smtpPort || 'default (587)',
        secure: smtpSecure || 'inferred from port',
        smtpUserConfigured: Boolean(process.env.SMTP_USER?.trim()),
        smtpPasswordConfigured: Boolean(process.env.SMTP_PASS?.trim()),
        senderSource: process.env.FROM_EMAIL?.trim()
            ? 'FROM_EMAIL'
            : process.env.EMAIL_FROM?.trim()
                ? 'EMAIL_FROM'
                : process.env.SMTP_USER?.trim()
                    ? 'SMTP_USER fallback'
                    : 'missing',
        recipientSource: process.env.ADMIN_EMAIL?.trim()
            ? 'ADMIN_EMAIL'
            : process.env.SUPPORT_EMAIL?.trim()
                ? 'SUPPORT_EMAIL'
                : 'missing'
    };
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[character]);
}

function createConfigurationError(message, diagnostics = getSmtpDiagnostics()) {
    const error = new Error(message);
    error.code = 'SMTP_NOT_CONFIGURED';
    error.diagnostics = diagnostics;
    return error;
}

function isGmailHost(host) {
    return ['smtp.gmail.com', 'smtp.googlemail.com'].includes(host.toLowerCase());
}

function getSmtpConfig() {
    const fromEmail = process.env.FROM_EMAIL?.trim() || process.env.EMAIL_FROM?.trim();
    const adminEmail = process.env.ADMIN_EMAIL?.trim() || process.env.SUPPORT_EMAIL?.trim();
    const requiredVariables = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
    const missingVariables = requiredVariables.filter(name => !process.env[name]?.trim());

    if (!adminEmail) {
        missingVariables.push('ADMIN_EMAIL or SUPPORT_EMAIL');
    }

    if (missingVariables.length > 0) {
        throw createConfigurationError(`Missing SMTP configuration: ${missingVariables.join(', ')}`);
    }

    const port = Number(process.env.SMTP_PORT || 587);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw createConfigurationError('SMTP_PORT must be a valid TCP port');
    }

    const host = process.env.SMTP_HOST.trim();
    const user = process.env.SMTP_USER.trim();
    const from = fromEmail || user;
    const secureSetting = process.env.SMTP_SECURE?.trim().toLowerCase();
    if (secureSetting !== undefined && !['true', 'false'].includes(secureSetting)) {
        throw createConfigurationError('SMTP_SECURE must be true or false');
    }
    const secure = secureSetting === undefined ? port === 465 : secureSetting === 'true';

    if (isGmailHost(host)) {
        if ((secure && port !== 465) || (!secure && port === 465)) {
            throw createConfigurationError('For Gmail, use SMTP_PORT=465 with SMTP_SECURE=true or SMTP_PORT=587 with SMTP_SECURE=false');
        }

        if (from.toLowerCase() !== user.toLowerCase()) {
            throw createConfigurationError('For Gmail, FROM_EMAIL or EMAIL_FROM must match SMTP_USER');
        }
    }

    return {
        host,
        port,
        secure,
        user,
        // Gmail presents App Passwords in groups. Whitespace is not part of the
        // password and would otherwise cause a 535 authentication failure.
        pass: isGmailHost(host) ? process.env.SMTP_PASS.replace(/\s/g, '') : process.env.SMTP_PASS,
        from,
        fromName: process.env.FROM_NAME?.trim() || 'Gobizness Rocket',
        to: adminEmail
    };
}

function getTransporter(config) {
    const key = JSON.stringify({
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: config.user,
        pass: config.pass
    });

    if (!transporter || transporterKey !== key) {
        transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.user,
                pass: config.pass
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 30000,
            tls: { minVersion: 'TLSv1.2' }
        });
        transporterKey = key;
        verificationPromise = undefined;
    }

    return transporter;
}

function classifySmtpError(error) {
    if (error?.code === 'EAUTH' || error?.responseCode === 535 || error?.responseCode === 534) {
        return 'SMTP_AUTH_FAILED';
    }

    if (['ECONNREFUSED', 'ECONNRESET', 'ESOCKET', 'ETIMEDOUT', 'EDNS'].includes(error?.code)) {
        return 'SMTP_CONNECTION_FAILED';
    }

    return 'SMTP_DELIVERY_FAILED';
}

function createMailError(stage, cause) {
    const error = new Error(`Unable to send ${stage} email: ${cause.message}`);
    error.code = classifySmtpError(cause);
    error.mailStage = stage;
    error.smtpCode = cause.code;
    error.responseCode = cause.responseCode;
    error.smtpResponse = cause.response;
    error.command = cause.command;
    error.cause = cause;
    return error;
}

function logMailFailure(enquiryId, error) {
    console.error('[mail] delivery failed', {
        enquiryId,
        stage: error.mailStage || 'SMTP verification',
        code: error.code,
        smtpCode: error.smtpCode,
        responseCode: error.responseCode,
        smtpResponse: error.smtpResponse,
        command: error.command,
        diagnostics: error.diagnostics,
        message: error.message
    });
}

async function verifyTransport(mailer, config, enquiryId) {
    if (!verificationPromise) {
        verificationPromise = mailer.verify().then(() => {
            console.info('[mail] SMTP connection verified', {
                host: config.host,
                port: config.port,
                secure: config.secure
            });
        }).catch(error => {
            verificationPromise = undefined;
            throw createMailError('SMTP verification', error);
        });
    }

    try {
        await verificationPromise;
    } catch (error) {
        logMailFailure(enquiryId, error);
        throw error;
    }
}

function mailFrom(config) {
    return { name: config.fromName, address: config.from };
}

function buildAdminMessage(enquiry, safe, config) {
    const subjectName = enquiry.name.replace(/[\r\n]+/g, ' ').slice(0, 100);
    const subjectService = enquiry.service.replace(/[\r\n]+/g, ' ').slice(0, 100);

    return {
        from: mailFrom(config),
        to: config.to,
        replyTo: enquiry.email,
        subject: `New website enquiry: ${subjectService} from ${subjectName}`,
        text: [
            'New website enquiry received',
            '',
            `Name: ${enquiry.name}`,
            `Email: ${enquiry.email}`,
            `Phone: ${enquiry.phone}`,
            `Service: ${enquiry.service}`,
            `Budget: ${enquiry.budget}`,
            `Message: ${enquiry.message}`,
            `Received: ${safe.receivedAt}`
        ].join('\n'),
        html: `
            <h2>New Website Enquiry</h2>
            <table style="border-collapse:collapse;width:100%;max-width:720px">
                <tr><th style="padding:8px;border:1px solid #ddd;text-align:left">Name</th><td style="padding:8px;border:1px solid #ddd">${safe.name}</td></tr>
                <tr><th style="padding:8px;border:1px solid #ddd;text-align:left">Email</th><td style="padding:8px;border:1px solid #ddd">${safe.email}</td></tr>
                <tr><th style="padding:8px;border:1px solid #ddd;text-align:left">Phone</th><td style="padding:8px;border:1px solid #ddd">${safe.phone}</td></tr>
                <tr><th style="padding:8px;border:1px solid #ddd;text-align:left">Service</th><td style="padding:8px;border:1px solid #ddd">${safe.service}</td></tr>
                <tr><th style="padding:8px;border:1px solid #ddd;text-align:left">Budget</th><td style="padding:8px;border:1px solid #ddd">${safe.budget}</td></tr>
                <tr><th style="padding:8px;border:1px solid #ddd;text-align:left">Message</th><td style="padding:8px;border:1px solid #ddd;white-space:pre-wrap">${safe.message}</td></tr>
                <tr><th style="padding:8px;border:1px solid #ddd;text-align:left">Received</th><td style="padding:8px;border:1px solid #ddd">${safe.receivedAt}</td></tr>
            </table>
        `
    };
}

function buildConfirmationMessage(enquiry, safe, config) {
    return {
        from: mailFrom(config),
        to: enquiry.email,
        replyTo: config.to,
        subject: 'We received your enquiry — Gobizness Rocket',
        text: [
            `Hi ${enquiry.name},`,
            '',
            `Thank you for contacting Gobizness Rocket. We received your enquiry about ${enquiry.service} on ${safe.receivedAt}.`,
            'Our team will review the details and contact you within 24 hours.',
            '',
            'If you need to add anything, reply to this email.',
            '',
            'Regards,',
            'Gobizness Rocket'
        ].join('\n'),
        html: `
            <p>Hi ${safe.name},</p>
            <p>Thank you for contacting Gobizness Rocket. We received your enquiry about <strong>${safe.service}</strong> on ${safe.receivedAt}.</p>
            <p>Our team will review the details and contact you within 24 hours.</p>
            <p>If you need to add anything, reply to this email.</p>
            <p>Regards,<br>Gobizness Rocket</p>
        `
    };
}

async function sendEnquiryEmail(enquiry) {
    const config = getSmtpConfig();
    const mailer = getTransporter(config);
    const receivedAt = new Date(enquiry.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
        timeZone: 'Asia/Kolkata'
    });
    const safe = Object.fromEntries(Object.entries({
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        service: enquiry.service,
        budget: enquiry.budget,
        message: enquiry.message,
        receivedAt
    }).map(([key, value]) => [key, escapeHtml(value)]));

    console.info('[mail] enquiry delivery started', {
        enquiryId: enquiry.id,
        smtp: getSmtpDiagnostics(),
        confirmationRecipientConfigured: Boolean(enquiry.email)
    });

    await verifyTransport(mailer, config, enquiry.id);

    const deliveries = await Promise.allSettled([
        mailer.sendMail(buildAdminMessage(enquiry, safe, config)),
        mailer.sendMail(buildConfirmationMessage(enquiry, safe, config))
    ]);
    const failedDelivery = deliveries.find(result => result.status === 'rejected');

    if (failedDelivery) {
        const error = createMailError(
            deliveries.indexOf(failedDelivery) === 0 ? 'admin notification' : 'customer confirmation',
            failedDelivery.reason
        );
        logMailFailure(enquiry.id, error);
        throw error;
    }

    console.info('[mail] enquiry emails accepted by SMTP', {
        enquiryId: enquiry.id,
        admin: {
            messageId: deliveries[0].value.messageId,
            accepted: deliveries[0].value.accepted?.length || 0,
            rejected: deliveries[0].value.rejected?.length || 0,
            response: deliveries[0].value.response
        },
        confirmation: {
            messageId: deliveries[1].value.messageId,
            accepted: deliveries[1].value.accepted?.length || 0,
            rejected: deliveries[1].value.rejected?.length || 0,
            response: deliveries[1].value.response
        }
    });

    return {
        admin: deliveries[0].value,
        confirmation: deliveries[1].value
    };
}

module.exports = { sendEnquiryEmail };
