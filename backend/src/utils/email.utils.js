import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendOtpEmail = async ({
    email,
    username,
    otp
}) => {

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Gearnix Email Verification OTP',
        text: `Hello ${username},

Your Gearnix verification OTP is:

${otp}

This OTP will expire in 10 minutes.

If you did not create a Gearnix account, you can ignore this email.

Regards , 
Gearnix Team.
`
    });
};