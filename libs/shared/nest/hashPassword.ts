import { SALT_ROUNDS } from "@core/nest";
import { hash } from "bcryptjs";

export const hashPassword = async (password: string) => {
  return await hash(password, SALT_ROUNDS);
};
