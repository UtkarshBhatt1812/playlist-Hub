import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const algorithm = "aes-256-gcm";

const getEncryptionKey = () => {
  const secret =
    process.env.SPOTIFY_TOKEN_ENCRYPTION_SECRET ||
    process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error("Missing encryption secret for Spotify token storage");
  }

  return crypto.createHash("sha256").update(secret).digest();
};

export const encryptText = (value) => {
  if (!value) {
    return "";
  }

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
};

export const decryptText = (value) => {
  if (!value) {
    return "";
  }

  const [ivPart, authTagPart, encryptedPart] = value.split(".");

  if (!ivPart || !authTagPart || !encryptedPart) {
    throw new Error("Invalid encrypted value");
  }

  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivPart, "base64url"),
  );

  decipher.setAuthTag(Buffer.from(authTagPart, "base64url"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedPart, "base64url")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};
