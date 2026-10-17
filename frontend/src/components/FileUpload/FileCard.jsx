import React from "react";
import {
  FiFile,
  FiX,
  FiFileText,
  FiImage,
  FiCheckCircle,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../BgContext/ThemeContext";
import toast from "react-hot-toast";
import {
  removeUploadedFile,
  setActiveFile,
} from "../../redux/fileSlice";
import { DeleteFileRAG } from "../../Features/DeleteFileRAG";

export default function FileCard() {
  const { dark } = useTheme();
  const dispatch = useDispatch();

  const { uploadedFiles, activeFileId } = useSelector((state) => state.file);
  const userdata = useSelector((state) => state.user.userdata);

  if (!uploadedFiles || uploadedFiles.length === 0) return null;

  const getFileIcon = (fileType) => {
    if (fileType === "image") return <FiImage size={16} />;
    if (fileType === "pdf") return <FiFileText size={16} />;
    return <FiFile size={16} />;
  };

  const getFileColor = (fileType) => {
    switch (fileType) {
      case "pdf":
        return "from-red-500 to-pink-500";
      case "docx":
      case "doc":
        return "from-blue-500 to-cyan-500";
      case "excel":
        return "from-green-500 to-emerald-500";
      case "image":
        return "from-purple-500 to-pink-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const handleRemove = async (fileId, fileName) => {
    try {
    
      if (userdata?._id) {
        await DeleteFileRAG(fileId, userdata._id);
      }

      dispatch(removeUploadedFile(fileId));
      toast.success(`${fileName} removed`);
    } catch (error) {
      console.error("Delete error:", error);
     
      dispatch(removeUploadedFile(fileId));
      toast.success(`${fileName} removed`);
    }
  };

  return (
    <div className="mx-auto mb-2 max-w-4xl">
      <div className="flex flex-wrap gap-2">
        {uploadedFiles.map((file) => {
          const isActive = activeFileId === file.fileId;

          return (
            <div
              key={file.fileId}
              onClick={() =>
                dispatch(
                  setActiveFile({
                    fileId: file.fileId,
                    fullText: file.fullText,
                  })
                )
              }
              className={`group flex max-w-[260px] cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs transition-all ${
                isActive
                  ? dark
                    ? "border-purple-500/40 bg-purple-500/10"
                    : "border-purple-300 bg-purple-50"
                  : dark
                  ? "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
              }`}
            >
             
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white ${getFileColor(
                  file.fileType
                )}`}
              >
                {getFileIcon(file.fileType)}
              </div>

           
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-[11px] font-medium ${
                    dark ? "text-white" : "text-gray-900"
                  }`}
                  title={file.fileName}
                >
                  {file.fileName}
                </p>
                <p
                  className={`text-[9px] ${
                    dark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {file.fileType?.toUpperCase()} • {file.chunksStored} chunks
                </p>
              </div>

            
              {isActive && (
                <FiCheckCircle
                  size={14}
                  className="shrink-0 text-purple-500"
                />
              )}

           
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(file.fileId, file.fileName);
                }}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md opacity-0 transition group-hover:opacity-100 ${
                  dark
                    ? "text-gray-500 hover:bg-red-500/20 hover:text-red-400"
                    : "text-gray-400 hover:bg-red-100 hover:text-red-600"
                }`}
                title="Remove file"
              >
                <FiX size={12} />
              </button>
            </div>
          );
        })}
      </div>

     
      {activeFileId && (
        <p
          className={`mt-1.5 text-[10px] ${
            dark ? "text-purple-400" : "text-purple-600"
          }`}
        >
           Ask questions about the selected file
        </p>
      )}
    </div>
  );
}