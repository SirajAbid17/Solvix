
import React, { useRef, useState } from "react";
import { useTheme } from "../../BgContext/ThemeContext";
import {
  FiPaperclip,
  FiFile,
  FiImage,
  FiX,
} from "react-icons/fi";

export default function Document({
  onFileSelect,
  onFileRemove,
  selectedFiles = [],
}) {
  const { dark } = useTheme();

  const fileInputRef = useRef(null);
  const [error, setError] = useState("");

  // Settings
  const MAX_SIZE = 10 * 1024 * 1024;
  const MAX_FILES = 5;

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Check maximum files
    if (selectedFiles.length + files.length > MAX_FILES) {
      setError("Maximum 5 files allowed");

      setTimeout(() => {
        setError("");
      }, 3000);

      e.target.value = "";
      return;
    }

    // Check file size
    const validFiles = [];

    files.forEach((file) => {
      if (file.size > MAX_SIZE) {
        setError(file.name + " is larger than 10MB");
      } else {
        validFiles.push(file);
      }
    });

    // Add valid files
    if (validFiles.length > 0) {
      onFileSelect([...selectedFiles, ...validFiles]);
    }

    // Reset input
    e.target.value = "";
  };

  // Remove one file
  const removeFile = (index) => {
    if (onFileRemove) {
      onFileRemove(index);
    }
  };

  // Remove all files
  const clearAllFiles = () => {
    if (onFileRemove) {
      onFileRemove("all");
    }
  };

  // File icon
  const getFileIcon = (file) => {
    if (file.type && file.type.startsWith("image/")) {
      return <FiImage size={18} />;
    }

    return <FiFile size={18} />;
  };

  return (
    <div className="relative">

      {/* Attach Button */}
      <button
        type="button"
        onClick={openFilePicker}
        title="Attach file"
        className={
          "relative w-10 h-10 flex items-center justify-center rounded-xl " +
          "transition-all duration-200 hover:scale-105 active:scale-95 " +
          (dark
            ? "text-gray-400 hover:bg-white/10 hover:text-white"
            : "text-gray-500 hover:bg-gray-100 hover:text-black")
        }
      >
        <FiPaperclip size={19} />

        {/* File Count */}
        {selectedFiles.length > 0 && (
          <span
            className="
              absolute
              -top-1
              -right-1
              w-5
              h-5
              rounded-full
              bg-blue-500
              text-white
              text-[10px]
              font-bold
              flex
              items-center
              justify-center
            "
          >
            {selectedFiles.length}
          </span>
        )}
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div
          className="
            absolute
            bottom-full
            left-0
            mb-2
            z-50
            px-3
            py-2
            rounded-lg
            bg-red-500
            text-white
            text-xs
            whitespace-nowrap
            shadow-lg
          "
        >
          {error}
        </div>
      )}

      {/* Selected Files Popup */}
      {selectedFiles.length > 0 && (
        <div
          className={
            "absolute bottom-full left-0 mb-2 w-72 p-3 rounded-xl shadow-xl z-40 " +
            (dark
              ? "bg-[#1a1a1a] border border-white/10"
              : "bg-white border border-gray-200")
          }
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span
              className={
                "text-xs font-medium " +
                (dark ? "text-gray-400" : "text-gray-500")
              }
            >
              {selectedFiles.length} file(s) attached
            </span>

            <button
              type="button"
              onClick={clearAllFiles}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Clear all
            </button>
          </div>

          {/* Files */}
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className={
                  "flex items-center gap-2 p-2 rounded-lg transition " +
                  (dark
                    ? "hover:bg-white/5"
                    : "hover:bg-gray-100")
                }
              >
                {/* File Icon */}
                <div
                  className={
                    "w-9 h-9 rounded-lg flex items-center justify-center " +
                    (dark
                      ? "bg-white/10 text-gray-300"
                      : "bg-gray-100 text-gray-500")
                  }
                >
                  {getFileIcon(file)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={
                      "text-xs font-medium truncate " +
                      (dark
                        ? "text-gray-300"
                        : "text-gray-700")
                    }
                  >
                    {file.name}
                  </p>

                  <p className="text-[10px] text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className={
                    "p-1 rounded-md transition " +
                    (dark
                      ? "text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                      : "text-gray-400 hover:bg-red-50 hover:text-red-500")
                  }
                >
                  <FiX size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

