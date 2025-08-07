import admin from "../config/firebase.js";

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized: No token" });

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // includes uid, email, phone_number, etc.
   
    next();
  } catch (err) {
    console.error("Firebase Auth Error:", err.message);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
