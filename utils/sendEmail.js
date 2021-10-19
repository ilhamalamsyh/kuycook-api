/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-promise-reject-errors */
require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        // type: 'OAuth2',
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    return await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = sendEmail;

// using OAuth2 googleapis
// try {
//   const oauth2Client = new OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     'https://developers.google.com/oauthplayground'
//   );

//   oauth2Client.setCredentials({
//     refresh_token: process.env.REFRESH_TOKEN,
//   });

//   const accessToken = await new Promise((resolve, reject) => {
//     oauth2Client.getAccessToken((err, token) => {
//       if (err) {
//         reject('Failed to create access token :(');
//       }
//       resolve(token);
//     });
//   });

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     secure: true,
//     auth: {
//       type: 'OAuth2',
//       user: process.env.EMAIL_USER,
//       accessToken,
//       clientId: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       refreshToken: process.env.REFRESH_TOKEN,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });

//   console.log('email sent successfully');

//   return await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject,
//     text,
//   });
// } catch (error) {
//   console.log(error, 'email not sent');
//   throw new Error(error);
// }
