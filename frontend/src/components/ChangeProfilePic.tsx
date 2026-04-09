/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from "react";
import { Camera, Upload, X, Check, Loader2 } from "lucide-react";
import { returnUrl } from "../utils/cloudinaryHelper";

interface ChangeProfilePicProps {
  currentImage: string;
  onClose: () => void;
  onUpload: (url: string) => void;
}

const ChangeProfilePic: React.FC<ChangeProfilePicProps> = ({
  currentImage,
  onClose,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setUploadProgress("Uploading to Cloudinary...");
      const cloudinaryUrl = await returnUrl(selectedFile);

      setUploadProgress("Saving to database...");
      await onUpload(cloudinaryUrl);

      setUploadProgress("Success!");
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err?.message || "Failed to upload image");
      setUploadProgress("");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(currentImage);
    setError(null);
    setUploadProgress("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">
            Change Profile Picture
          </h2>
          <p className="text-sm text-slate-400">
            Double-click on your photo anytime to update it
          </p>
        </div>

        <div className="mb-6">
          <div className="relative w-48 h-48 mx-auto mb-4">
            {previewUrl ? (
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full rounded-full object-cover border-4 border-slate-700"
                />
                {selectedFile && (
                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-50 -z-10"></div>
              </div>
            ) : (
              <div className="w-full h-full rounded-full bg-slate-700 border-4 border-slate-600 flex items-center justify-center">
                <Camera className="w-16 h-16 text-slate-500" />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-5 h-5" />
            {selectedFile ? "Change Image" : "Select Image"}
          </button>
        </div>

        {uploadProgress && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {uploadProgress}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {selectedFile && !uploadProgress && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300">
              <span className="font-medium">File:</span> {selectedFile.name}
            </p>
            <p className="text-xs text-blue-400 mt-1">
              Size: {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            disabled={loading || !selectedFile}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            className="flex-1 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Upload
              </>
            )}
          </button>
        </div>

        <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
          <p className="text-xs text-slate-400">
            <span className="font-medium text-slate-300">Tips:</span> Use a
            square image for best results. Max size: 5MB. Supported: JPG, PNG,
            GIF, WebP.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePic;
