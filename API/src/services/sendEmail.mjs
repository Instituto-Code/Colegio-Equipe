import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

//Criando transporter para envio de email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.APP_PASS,
  },
});

//Criando corpo de envio
export const sendResetPass = async (to, resetLink) => {
  const mailOption = {
    from: process.env.USER_EMAIL,
    to,
    subject: `Modificação de senha`,
    html: `
        <h2>Redefinição de Senha</h2>
      <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para prosseguir:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Se você não solicitou isso, ignore este e-mail.</p>
        `,
  };

  try{
    await transporter.sendMail(mailOption);
    return true;
  }
  catch(error){
    console.log(error);
    return false;
  }
};
