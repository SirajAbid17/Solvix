import React, { useRef, useState } from "react";
import {
  FiUploadCloud,
  FiX,
  FiFile,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { UploadFile } from "../../Features/UploadFile";
import { addUploadedFile, setUploading } from "../../redux/fileSlice";

export default function Fileloaded({ dark = true, onClose, onUploadSuccess }) {
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const userdata = useSelector((state) => state.user.userdata);

  const [file, setFile] = useState(null);
  const [uploading, setLocalUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (!droppedFile) return;
    setFile(droppedFile);
  };

  const handleAddFile = async () => {
    if (!file || uploading) return;

    if (!userdata?._id) {
      toast.error("Please login first");
      return;
    }

    try {
      setLocalUploading(true);
      dispatch(setUploading(true));

      const toastId = toast.loading(
        `Processing ${file.name}... This may take a moment`,
      );

      const response = await UploadFile(file, userdata._id);

      toast.dismiss(toastId);

      if (!response?.success) {
        throw new Error(response?.message || "Upload failed");
      }

      const fileData = response.file;

     
      dispatch(
        addUploadedFile({
          fileId: fileData.fileId,
          fileName: fileData.fileName,
          fileType: fileData.fileType,
          size: fileData.size,
          mimetype: fileData.mimetype,
          fullText: fileData.fullText,
          textPreview: fileData.textPreview,
          chunksStored: fileData.chunksStored,
          
          imageBase64: fileData.imageBase64 || null,
          imageMimeType: fileData.imageMimeType || null,
          uploadedAt: new Date().toISOString(),
        }),
      );

      if (fileData.ragStored) {
        toast.success(
          `${file.name} uploaded & ready for questions! (${fileData.chunksStored} chunks)`,
          { duration: 4000 },
        );
      } else {
        toast.success(`${file.name} uploaded!`);
      }

     
      if (onUploadSuccess) {
        onUploadSuccess({
          fileId: fileData.fileId,
          fileName: fileData.fileName,
          fileType: fileData.fileType,
          size: fileData.size,
          imageBase64: fileData.imageBase64 || null,
          imageMimeType: fileData.imageMimeType || null,
        });
      }

      setFile(null);
      if (inputRef.current) inputRef.current.value = "";

      if (onClose) onClose();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to process file";
      toast.error(msg, { duration: 5000 });
    } finally {
      setLocalUploading(false);
      dispatch(setUploading(false));
    }
  };

  const handleClose = () => {
    if (uploading) return;
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    if (onClose) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border p-5 shadow-2xl ${
          dark
            ? "border-white/10 bg-[#111214] text-white"
            : "border-gray-200 bg-white text-gray-900"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Upload file for AI</h2>
            <p
              className={`mt-1 text-xs ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              PDF, DOCX, XLSX, Images — AI will read & answer questions
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={uploading}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition disabled:opacity-50 ${
              dark
                ? "text-gray-500 hover:bg-white/10 hover:text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-black"
            }`}
          >
            <FiX size={18} />
          </button>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`group cursor-pointer rounded-xl border border-dashed p-8 text-center transition-all duration-200 ${
            uploading ? "opacity-50 pointer-events-none" : ""
          } ${
            dark
              ? "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.md,.json,.xml,image/*"
          />

          <div
            className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${
              dark
                ? "bg-white/[0.06] text-gray-300"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <FiUploadCloud size={26} />
          </div>

          <p className="text-sm font-medium">Click to upload</p>
          <p
            className={`mt-1 text-xs ${
              dark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            or drag and drop your file here
          </p>

          <p
            className={`mt-3 text-[11px] ${
              dark ? "text-gray-600" : "text-gray-400"
            }`}
          >
            PDF, DOCX, XLSX, TXT, MD, JSON, Images (Max 25MB)
          </p>
        </div>

        {file && (
          <div
            className={`mt-4 flex items-center gap-3 rounded-xl border p-3 ${
              dark
                ? "border-white/10 bg-white/[0.03]"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                dark
                  ? "bg-white/[0.06] text-gray-300"
                  : "bg-white text-gray-600"
              }`}
            >
              <FiFile size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p
                className={`mt-0.5 text-[11px] ${
                  dark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <FiCheckCircle size={18} className="shrink-0 text-green-500" />
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={uploading}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
              dark
                ? "text-gray-400 hover:bg-white/5 hover:text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-black"
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!file || uploading}
            onClick={handleAddFile}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              file && !uploading
                ? dark
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-black text-white hover:bg-gray-800"
                : dark
                  ? "cursor-not-allowed bg-white/10 text-gray-600"
                  : "cursor-not-allowed bg-gray-100 text-gray-400"
            }`}
          >
            {uploading ? (
              <>
                <FiLoader size={14} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>Process File</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
