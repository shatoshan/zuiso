"use client";

import { useState } from "react";
import { useAuthContext } from "@/lib/firebase/authContext";
import ImageUploader from "@/components/images/ImageUploader";
import ImageGrid from "@/components/images/ImageGrid";

export default function Dashboard() {
  const { user } = useAuthContext();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // 画像リストを強制的に更新するためのキー

  const handleUploadSuccess = () => {
    setUploadSuccess(true);
    setUploadError("");
    // アップロード成功後、画像リストを更新
    setRefreshKey((prev) => prev + 1);

    // 成功メッセージを3秒後に消す
    setTimeout(() => {
      setUploadSuccess(false);
    }, 3000);
  };

  const handleUploadError = (error: Error) => {
    setUploadError(error.message);
    setUploadSuccess(false);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          ダッシュボード
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          画像をアップロードして、AIによる分析結果を確認できます
        </p>
      </div>

      {uploadSuccess && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          画像のアップロードに成功しました！
        </div>
      )}

      {uploadError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          エラー: {uploadError}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">画像のアップロード</h2>
        <ImageUploader
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">アップロードされた画像</h2>
        <ImageGrid key={refreshKey} />
      </div>
    </main>
  );
}
