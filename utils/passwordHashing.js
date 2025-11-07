import bcrypt from "bcrypt";

const SALT_ROUNDS = 10; // 10-12 for production

export const hashPassword = async (plainPassword) => {
  const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hashed;
};

export const comparePasswords = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};
