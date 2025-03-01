import { storage } from "./config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "./config";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

// 画像アップロード関数
export const uploadImage = async (file: File, userId: string) => {
  try {
    // ファイル名（ユニークにするために日時を含める）
    const filename = `${Date.now()}_${file.name}`;
    const storagePath = `users/${userId}/images/${filename}`;

    // Storageにアップロード
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file);

    // ダウンロードURLを取得
    const downloadUrl = await getDownloadURL(snapshot.ref);

    // 画像メタデータを作成
    const imageData = {
      id: doc(collection(db, "images")).id, // 自動生成ID
      userId,
      filename,
      storagePath,
      downloadUrl,
      contentType: file.type,
      size: file.size,
      category: "unknown", // AIで分析後に更新予定
      metadata: {},
      aiComment: "",
      tags: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Firestoreに保存
    await setDoc(doc(db, "images", imageData.id), imageData);

    return imageData;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};

// ユーザーの画像を取得する関数
export const getUserImages = async (userId: string, limitCount = 20) => {
  try {
    const imagesRef = collection(db, "images");
    const imagesQuery = query(
      imagesRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(imagesQuery);
    const images = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return images;
  } catch (error) {
    console.error("Error getting user images: ", error);
    throw error;
  }
};
