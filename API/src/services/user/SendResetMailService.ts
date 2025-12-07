
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { UserRepository } from "../../repositories/UserRepository.js";
import { sendResetPass } from "../../configs/sendEmail.js";

export async function SendResetPassMailService(email: string) {
  const user = await UserRepository.findByEmail(email);

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  // gerar token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // gerar hash
  const tokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // salvar no user
  user.resetPassToken = tokenHash;
  user.resetPassTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/resetPass/${resetToken}`;

  // envia email
  await sendResetPass(email, resetLink);

  return { message: "E-mail enviado." };
}
