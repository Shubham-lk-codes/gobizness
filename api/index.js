// Vercel Serverless Function entry point.
// Exports the Express app so Vercel can invoke it as a handler for every
// request matched by the "/api/:path*" rewrite in vercel.json.
const app = require('../server');

module.exports = app;
