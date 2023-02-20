/***/
import * as crypto from "crypto";
import {Request} from "firebase-functions/lib/common/providers/https";

export default class SignatureVerifier {
  constructor(private key: string) {
  }

  tryVerify(request: Request): string {
    const hmac = crypto.createHmac(
      "sha256",
      this.key
    );

    hmac.update(
      request.method +
      request.url +
      request.headers.requestid +
      (request.rawBody?.toString() || "null")
    );

    const serverSignature = hmac.digest("hex");

    if (serverSignature !== request.headers.signature) {
      throw new Error(
        "Signature mismatch: " +
        serverSignature +
        " vs " +
        request.headers.signature
      );
    }

    return serverSignature;
  }
}
