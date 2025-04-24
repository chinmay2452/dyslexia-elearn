import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const saveQuizResult = async (resultPercentage: number, userId?: string) => {
  try {
    const docRef = await addDoc(collection(db, "quizResults"), {
      userId: userId || null,
      result: resultPercentage,
      createdAt: Timestamp.now(),
    });

    console.log("Quiz result saved with ID:", docRef.id);
  } catch (error) {
    console.error("Error saving quiz result:", error);
  }
};
