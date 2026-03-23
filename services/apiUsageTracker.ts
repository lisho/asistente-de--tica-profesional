import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export async function logApiUsage(assistantName: string, promptTokens: number, candidatesTokens: number, totalTokens: number) {
  try {
    // Check if Firebase config is missing (by checking if projectId is empty)
    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
        console.warn('Firebase config missing: skipping API usage logging.');
        return;
    }

    const usageRef = collection(db, 'api_usage');
    await addDoc(usageRef, {
      assistantName,
      promptTokens,
      candidatesTokens,
      totalTokens,
      timestamp: serverTimestamp()
    });
    console.log('API Usage logged successfully.');
  } catch (error) {
    console.error('Error logging API usage to Firebase:', error);
  }
}
