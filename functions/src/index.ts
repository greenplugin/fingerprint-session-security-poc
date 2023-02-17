import * as crypto from "crypto";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.database();

export const ping = functions.region("europe-west1")
  .https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send(
      {body: request.body, headers: request.headers, query: request.query}
    );
  });

export const issueSession = functions.region("europe-west1").https
  .onRequest(async (request, response) => {
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

    response.send(session);
  }
);


export const verifySession = functions.region("europe-west1").https
  .onRequest(async (request, response) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response.status(401).send("Unauthorized");
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      await db.ref("sessions").child(token).once("value", (snapshot) => {
        if (snapshot.exists()) {
          response.send(snapshot.val());
        } else {
          response.status(401).send("Unauthorized");
        }
      });
    } catch (error) {
      functions.logger.error(error);
      response.status(500).send("Internal Server Error");
    }
  }
);
