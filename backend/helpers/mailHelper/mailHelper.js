import mailer from "nodemailer";

export const mailHelper = (mailOptions) =>
{
    const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS} = process.env;
    const transport = mailer.createTransport({
        host:SMTP_HOST,
        port:SMTP_PORT,
        auth:{
            user:SMTP_USER,
            pass:SMTP_PASS
        }
    });

    transport.sendMail(mailOptions);
}

