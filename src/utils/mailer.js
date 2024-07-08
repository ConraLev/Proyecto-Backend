const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendMail = (to, subject, html) => {
  const mailOptions = {
    from: 'eCommerce <recover@eCommerce.com>',
    to,
    subject: 'Restablecer Contraseña',
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
