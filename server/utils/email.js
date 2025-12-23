const nodemailer = require('nodemailer');

let transporter = null;
let usingTestAccount = false;

async function createTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // verify connection (will throw if cannot connect)
    try {
      await transporter.verify();
      usingTestAccount = false;
      return transporter;
    } catch (err) {
      console.warn('SMTP verify failed, falling back to test account:', err.message);
      transporter = null;
    }
  }

  // Fallback to ethereal test account for dev/testing
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  usingTestAccount = true;
  console.info('Using Nodemailer test account. Preview emails at the logged URL.');
  return transporter;
}

exports.sendEmail = async ({ to, subject, html, text }) => {
  const t = await createTransporter();
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@example.com';
  const info = await t.sendMail({ from, to, subject, html, text });

  if (usingTestAccount) {
    const preview = nodemailer.getTestMessageUrl(info);
    console.info('Preview URL:', preview);
  }
  return info;
};
