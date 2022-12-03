const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const config = require('./config.js');

const {
  MAIL_CLIENT_ID,
  MAIL_CLIENT_SECRET,
  MAIL_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS,
} = process.env;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const CLIENT_ID = `${MAIL_CLIENT_ID}`;
const CLIENT_SECRET = `${MAIL_CLIENT_SECRET}`;
const REFRESH_TOKEN = `${MAIL_REFRESH_TOKEN}`;
const SENDER_MAIL = `${SENDER_EMAIL_ADDRESS}`;

// send mail
const sendEmail = async (to, url, txt) => {
  const oAuth2Client = new OAuth2Client(
    config.clientId,
    config.clientSecret,
    OAUTH_PLAYGROUND
  );

  oAuth2Client.setCredentials({ refresh_token: config.refreshToken });

  try {
    const access_token = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: config.senderMail,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken,
        access_token,
      },
    });

    const mailOptions = {
      from: config.senderMail,
      to: to,
      subject: "Activate Your Account😌",
      html: `
              <div style="max-width: 700px; margin:auto; padding: 50px 20px;">
              <h2 style="text-align: center; text-transform: uppercase;color: #f4a51c;">Welcome to Pilar.🛒</h2>
              <p>Congratulations! You're almost set to start using the Pilar Shopping Platform.
                  Just click the button below to validate your email address.
              </p>
              
              <a href=${url} style="background: #f4a51c; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
          
              <p>If the button doesn't work for any reason, you can also click on the link below:</p>
          
              <div>${url}</div>
              </div>
            `,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;
