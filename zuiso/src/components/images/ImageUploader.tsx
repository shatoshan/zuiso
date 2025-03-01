"use client";

import { useState, useRef } from "react";
import { uploadImage } from "@/lib/firebase/storage";
import { useAuthContext } from "@/lib/firebase/authContext";

type ImageUploaderProps = {
  onUploadSuccess?: (imageData: any) => void;
  onUploadError?: (error: Error) => void;
};

export default function ImageUploader({
  onUploadSuccess,
  onUploadError,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthContext();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    if (!user) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // アップロードの進行状況をシミュレート
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      // 画像をアップロード
      const uploadedImage = await uploadImage(files[0], user.uid);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (onUploadSuccess) {
        onUploadSuccess(uploadedImage);
      }

      // 少し待ってからリセット
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      if (onUploadError && error instanceof Error) {
        onUploadError(error);
      }
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
        isDragging
          ? "border-indigo-400 bg-indigo-50"
          : "border-gray-300 hover:border-indigo-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <div className="flex flex-col items-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        {isUploading ? (
          <div className="mt-4 w-full max-w-xs">
            <div className="mb-2 text-sm text-gray-600">
              アップロード中 ({uploadProgress}%)
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                className="h-2 bg-indigo-600 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-4 flex text-sm text-gray-600">
              <p className="pl-1">
                画像をドラッグアンドドロップするか、
                <span className="text-indigo-600 hover:text-indigo-500 cursor-pointer">
                  クリックしてアップロード
                </span>
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF 最大 10MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}
