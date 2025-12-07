import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";

export async function ResetPasswordService(token: string, newPass: string) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPassToken: tokenHash,
    resetPassTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error("Token expirado.");
  }

  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(newPass, salt);

  user.resetPassToken = undefined;
  user.resetPassTokenExpires = undefined;

  await user.save();

  return { message: "Senha redefinida com sucesso." };
}
