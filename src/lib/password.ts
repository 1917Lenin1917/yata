import { hash, compare } from "bcrypt";
import { ROUNDS_OF_SALT } from "@/constants/password";

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, ROUNDS_OF_SALT);
};

export const checkPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await compare(password, hash);
};
