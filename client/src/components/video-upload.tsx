"use client";

import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface VideoUploadProps {
  onUpload: (file: File) => void;
}

export function VideoUpload({ onUpload }: VideoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setUploading(true);

        // Upload file
        onUpload(file);

        // Reset uploading state after a delay (simulating upload)
        setTimeout(() => {
          setUploading(false);
        }, 2000);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const clearPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <div className="bg-[#252525] border border-[#333333] rounded-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-white">Video Upload</h2>
          <p className="text-[#a3a3a3] text-sm">Upload your video content</p>
        </div>
      </div>

      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-[#9333EA] bg-[#9333EA]/10"
              : "border-[#333333] hover:border-[#9333EA]"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 text-[#a3a3a3] mx-auto mb-4" />
          <p className="text-white mb-2">
            {isDragActive
              ? "Drop the video here"
              : "Drag & drop a video, or click to select"}
          </p>
          <p className="text-[#a3a3a3] text-sm">
            Supports MP4, MOV, AVI (max 100MB)
          </p>
        </div>
      ) : (
        <div className="relative">
          <video src={preview} className="w-full rounded-lg" controls />
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#9333EA] border-t-transparent" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
