import { db } from "./config";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { User } from "firebase/auth";

export const createUserProfile = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  // ユーザーが存在しない場合にのみ作成
  if (!userSnapshot.exists()) {
    const { email, displayName, photoURL, uid } = user;
    const createdAt = serverTimestamp();

    try {
      await setDoc(userRef, {
        uid,
        email,
        displayName: displayName || "",
        photoURL: photoURL || "",
        createdAt,
        updatedAt: createdAt,
      });
      return true;
    } catch (error) {
      console.error("Error creating user profile", error);
      return false;
    }
  }
  return true;
};

export const updateUserProfile = async (
  userId: string,
  data: Partial<{
    displayName: string;
    photoURL: string;
    [key: string]: any;
  }>
) => {
  const userRef = doc(db, "users", userId);
  try {
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating user profile", error);
    return false;
  }
};

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    return null;
  }
};
