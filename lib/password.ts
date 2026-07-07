import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const algorithm = "pbkdf2_sha256";
const defaultIterations = 210000;
const keyLength = 32;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = pbkdf2Sync(password, salt, defaultIterations, keyLength, "sha256").toString("base64url");

  return `${algorithm}$${defaultIterations}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [storedAlgorithm, iterationsValue, salt, hash] = storedHash.split("$");

  if (storedAlgorithm !== algorithm || !iterationsValue || !salt || !hash) {
    return false;
  }

  const iterations = Number(iterationsValue);
  if (!Number.isInteger(iterations) || iterations < 100000) {
    return false;
  }

  const candidate = pbkdf2Sync(password, salt, iterations, keyLength, "sha256");
  const expected = Buffer.from(hash, "base64url");

  return expected.length === candidate.length && timingSafeEqual(expected, candidate);
}
