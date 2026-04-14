import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Note: In a real scenario, these values are populated by the set_up_firebase tool
// into firebase-applet-config.json. Since the tool is currently failing, 
// we will use placeholders and explain the situation to the user.
const firebaseConfig = {
  apiKey: "PLACEHOLDER",
  authDomain: "PLACEHOLDER",
  projectId: "PLACEHOLDER",
  storageBucket: "PLACEHOLDER",
  messagingSenderId: "PLACEHOLDER",
  appId: "PLACEHOLDER"
};

// Try to load from config file if it exists (it might be created by the platform later)
let config = firebaseConfig;
try {
  // @ts-ignore
  import configData from './firebase-applet-config.json';
  config = configData;
} catch (e) {
  console.warn("Firebase config file not found. Using placeholders.");
}

const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
