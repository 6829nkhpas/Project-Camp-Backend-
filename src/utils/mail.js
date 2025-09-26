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