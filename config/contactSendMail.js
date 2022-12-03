const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const config = require("./config");

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
const contactSendMail = async (username, to, sub, txt) => {
  console.log(username, to, sub, txt, "mail");
  const oAuth2Client = new OAuth2Client(
    config.clientId,
    config.clientSecret,
    OAUTH_PLAYGROUND
  );

  oAuth2Client.setCredentials({ refresh_token: config.refreshToken});

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
      from: to,
      to: config.senderMail,
      subject: sub,
      html: `
              <div style="max-width: 700px; margin:auto; padding: 50px 20px;">
              <h2>Name : ${username} and email ${to}</h2>
              <p>${txt}</p>
              </div>
            `,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = contactSendMail;
