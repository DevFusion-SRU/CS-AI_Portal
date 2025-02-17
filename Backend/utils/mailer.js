import nodemailer from "nodemailer";

export const sendEmail = async (emailID, emailSubject, emailText) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", // or use another email service provider
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_APP_PASS, // Your email password or application-specific password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Your email address
        to: emailID,
        subject: emailSubject,
        text: emailText,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email: ", error);
        throw new Error("Error sending email");
    }
};
