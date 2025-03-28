const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  const { to, subject, text } = JSON.parse(event.body);
  
  const msg = {
    to,
    from: 'notifications@hnm.org',
    subject,
    text
  };

  try {
    await sgMail.send(msg);
    return { statusCode: 200, body: 'Email sent' };
  } catch (error) {
    return { statusCode: 400, body: error.message };
  }
};