import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendemail = async (options) => {
    const mailGenerator = new Mailgen({ 
        theme: 'default',
        product: {
            name: 'Camp',
            link: 'https://camp.com/'
        }
    });
    const emailTextualContent = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHTMLContent = mailGenerator.generate(options.mailgenContent);
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
        }
    });
    const mailOptions = {
        from: '"chianshift@gmail.com"',
        to: options.email,
        subject: options.subject,
        text: emailTextualContent,
        html: emailHTMLContent
    };
    try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(
      "Email service failed siliently. Make sure that you have provided your MAILTRAP credentials in the .env file",
    );
    console.error("Error: ", error);
  }

};
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
const forgotPasswordTemplate = (username, resetUrl) => {
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