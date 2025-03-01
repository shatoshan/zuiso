"use client";

import { useState, useEffect } from "react";
import { getUserImages } from "@/lib/firebase/storage";
import { useAuthContext } from "@/lib/firebase/authContext";
import Image from "next/image";

export default function ImageGrid() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchImages = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userImages = await getUserImages(user.uid);
        setImages(userImages);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("画像の読み込み中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          画像がありません。新しい画像をアップロードしてください。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <div className="relative h-48">
            <Image
              src={image.downloadUrl}
              alt={image.filename || "アップロードされた画像"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500 truncate">
              {new Date(image.createdAt?.seconds * 1000).toLocaleString(
                "ja-JP"
              )}
            </p>
            {image.category && image.category !== "unknown" && (
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mt-2">
                {image.category}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
