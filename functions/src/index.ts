import * as crypto from "crypto";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
import SignatureVerifier from "./SignatureVerifier";
import {Request} from "firebase-functions/lib/common/providers/https";
import {SessionValidationError} from "./Error/SessionValidationError";
import {database} from "firebase-admin";
import DataSnapshot = database.DataSnapshot;
import {Session} from "./DataObjects/Session";

admin.initializeApp();
const db = admin.database();

const corsHandler = cors({
  origin: true,
  allowedHeaders: ["Authorization", "Signature", "RequestId", "Content-Type"],
});

export const ping = functions.region("europe-west1")
  .https.onRequest((request, response) => {
    corsHandler(request, response, async () => {
      try {
        await getAuthorizedSession(request);
      } catch (e) {
        if (e instanceof SessionValidationError) {
          response.status(e.status).send(e.message);
          return;
        }

        functions.logger.error(e);
        response.status(500).send("Internal Server Error");
        return;
      }
      functions.logger.info("Hello logs!", {structuredData: true});
      response.send(
        {
          body: request.body,
          headers: request.headers,
          query: request.query,
          originalUrl: request.originalUrl,
          rawBody: request.rawBody?.toString(),
          url: request.url,
          baseUrl: request.baseUrl,
        }
      );
    });
  });

export const issueSession = functions.region("europe-west1").https
  .onRequest(async (request, response) => {
    corsHandler(request, response, async () => {
      if (request.method !== "POST") {
        response
          .status(404)
          .send("NotFound");
        return;
      }
      const token = crypto.randomBytes(128).toString("hex");

      const session = {
        token,
        name: request.body.name,
        avatarImageUrl: request.body.avatarImageUrl || null,
        fingerprintData: request.body.fingerprintData || null,
        fingerprint: request.body.fingerprint || null,
      };

      try {
        await db.ref("sessions").child(token).set(session);
      } catch (error) {
        functions.logger.error(error);
        response.status(500).send({
          body: request.body,
          headers: request.headers,
          query: request.query,
          title: "Internal Server Error",
        });
        return;
      }

      response.send({...session, rawBody: request.rawBody});
    });
  });


export const verifySession = functions.region("europe-west1").https
  .onRequest(async (request, response) => {
    corsHandler(request, response, async () => {
      try {
        response.send(await getAuthorizedSession(request));
      } catch (error) {
        if (error instanceof SessionValidationError) {
          response.status(error.status).send(error.message);
          return;
        }
        functions.logger.error(error);
        response.status(500).send("Internal Server Error");
      }
    });
  });


async function getAuthorizedSession(request: Request): Promise<Session> {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new SessionValidationError("No token header, or token mismatch", 401);
  }

  const token = authHeader.split(" ")[1];

  return new Promise((resolve, reject) => {
    db.ref("sessions").child(token).once("value", (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        try {
          const sessionValue: Session = snapshot.val();
          new SignatureVerifier(sessionValue.fingerprint).tryVerify(request);

          resolve(sessionValue);
        } catch (e: any) {
          functions.logger.error("Signature mismatch", {
            clientSignature: request.headers.signature,
            message: e.message,
            path: request.method +
              request.url +
              request.headers.requestid +
              (request.rawBody?.toString() || "null"),
          });

          reject(new SessionValidationError("Signature mismatch", 403));
        }
      } else {
        reject(new SessionValidationError("Unauthorized", 401));
      }
    });
  });
}
