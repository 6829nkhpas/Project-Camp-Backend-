import Mailgen from "mailgen";
import nodemailer from "nodemailer";

// sending email using nodemailer and mailgen
const emailsend = async (options) => {
    // create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // configure mailgen
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Camp',
            link: process.env.CLIENT_URL || 'http://localhost:3000/',
            // Optional product logo
            // logo: 'https://example.com/logo.png' 
        }
    });

    // generate email body
    const emailBody = mailGenerator.generate(options);

const emailVerificationTemplate = (username, verificationUrl) => {
    return{
        body:{
            name: username,
            intro: 'Welcome to Camp! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with Camp, please click here:',
                button: {   
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: verificationUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'    
        }
    }
};
constforgotPasswordTemplate = (username, resetUrl) => {
    return{
        body:{
            name: username,
            intro: 'You have received this email because a password reset request for your account was received.',
            action: {
                instructions: 'Click the button below to reset your password:',
                button: {   
                    color: '#DC4D2F', // Optional action button color
                    text: 'Reset your password',
                    link: resetUrl
                }
            },
            outro: 'If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 1 hour.'    
        }
    }
};
export {emailVerificationTemplate, forgotPasswordTemplate}; 