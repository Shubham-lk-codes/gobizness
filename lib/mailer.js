const nodemailer = require('nodemailer');

let transporter;

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[character]);
}

function getSmtpConfig() {
    const requiredVariables = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'ADMIN_EMAIL'];
    const missingVariables = requiredVariables.filter(name => !process.env[name]?.trim());

    if (missingVariables.length > 0) {
        const error = new Error(`Missing SMTP configuration: ${missingVariables.join(', ')}`);
        error.code = 'SMTP_NOT_CONFIGURED';
        throw error;
    }

    const port = Number(process.env.SMTP_PORT || 587);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        const error = new Error('SMTP_PORT must be a valid TCP port');
        error.code = 'SMTP_NOT_CONFIGURED';
        throw error;
    }

    return {
        host: process.env.SMTP_HOST.trim(),
        port,
        secure: process.env.SMTP_SECURE === 'true' || port === 465,
        user: process.env.SMTP_USER.trim(),
        pass: process.env.SMTP_PASS,
        from: process.env.FROM_EMAIL?.trim() || process.env.SMTP_USER.trim(),
        to: process.env.ADMIN_EMAIL.trim()
    };
}

function getTransporter(config) {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.user,
                pass: config.pass
            }
        });
    }

    return transporter;
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
    const subjectName = enquiry.name.replace(/[\r\n]+/g, ' ').slice(0, 100);
    const subjectService = enquiry.service.replace(/[\r\n]+/g, ' ').slice(0, 100);

    return mailer.sendMail({
        from: config.from,
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
            `Received: ${receivedAt}`
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
    });
}

module.exports = { sendEnquiryEmail };
