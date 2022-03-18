/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-promise-reject-errors */
require('dotenv').config();
const nodemailer = require('nodemailer');
const {google} = require('googleapis');

const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

// const sendEmail = async (email, subject, text) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 // type: 'OAuth2',
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//             tls: {
//                 rejectUnauthorized: false,
//             },
//         });
//         return await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject,
//             text,
//         });
//     } catch (error) {
//         throw new Error(error);
//     }
// };

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
})

const sendEmail = async (email, subject, text) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            text,
        }

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = sendEmail;