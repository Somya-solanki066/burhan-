import { randomBytes } from "crypto";

export function createLinkToken() {
  return randomBytes(18).toString("base64url");
}
