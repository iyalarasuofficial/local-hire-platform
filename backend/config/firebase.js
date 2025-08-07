// backend/config/firebase.js
import admin from 'firebase-admin';
import fs from 'fs/promises';

const data = await fs.readFile('./serviceAccountKey.json', 'utf-8');
const serviceAccount = JSON.parse(data);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;
