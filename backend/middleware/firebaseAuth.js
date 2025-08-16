import admin from "../config/firebase.js";

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    console.log("Incoming Authorization header:", authHeader);
    const parts = authHeader.trim().split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }
    const token = parts[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // includes uid, email, etc.
    next();
  } catch (err) {
    console.error("Firebase Auth Error:", err.message);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
