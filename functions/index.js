// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {onRequest} = require("firebase-functions/v2/https");
// The Firebase Admin SDK to access Firestore.
const {initializeApp, getAuth} = require("firebase-admin/app");

initializeApp();

exports.setCustomClaims = onRequest(async (req, res) => {
  // Get the ID token passed.
  const idToken = req.query.idToken;
  // Get the sign in provider.
  const provider = req.query.provider;
  // Verify the ID token and decode its payload.
  const decodedToken = await getAuth().verifyIdToken(idToken);
  const uid = decodedToken.uid;

  // Define custom claims.
  let customClaims;
  if (provider === "ios") {
    customClaims = {"iosUser": true};
  } else if (provider === "web") {
    customClaims = {"webUser": true};
  } else {
    res.status(400).send("Invalid provider.");
    return;
  }

  // Set custom user claims.
  await getAuth().setCustomUserClaims(uid, customClaims);
  res.send(`Custom claims set for user ${uid}`);
});
