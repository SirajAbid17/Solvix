// components/Resume/CV-Generate/components/ResumeActions.jsx
import { FaEdit, FaPrint, FaDownload, FaImage, FaTrash, FaSpinner } from "react-icons/fa";

export default function ResumeActions({ 
  id, 
  onEdit, 
  onPrint, 
  onDownload, 
  onDelete, 
  onRemoveImage, 
  hasProfileImage, 
  downloading 
}) {
  return (
    <div className="mb-6 flex flex-wrap justify-end gap-2">
      <button
        onClick={onEdit}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
      >
        <FaEdit className="h-4 w-4" />
        Edit
      </button>
      <button
        onClick={onPrint}
        className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700 transition flex items-center gap-2 shadow-sm"
      >
        <FaPrint className="h-4 w-4" />
        Print
      </button>
      <button
        onClick={onDownload}
        disabled={downloading}
        className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
      >
        {downloading ? (
          <FaSpinner className="h-4 w-4 animate-spin" />
        ) : (
          <FaDownload className="h-4 w-4" />
        )}
        {downloading ? "Downloading..." : "Download PDF"}
      </button>
      {hasProfileImage && (
        <button
          onClick={onRemoveImage}
          className="rounded-lg bg-yellow-600 px-4 py-2 text-sm text-white hover:bg-yellow-700 transition flex items-center gap-2 shadow-sm"
        >
          <FaImage className="h-4 w-4" />
          Remove Image
        </button>
      )}
      <button
        onClick={onDelete}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition flex items-center gap-2 shadow-sm"
      >
        <FaTrash className="h-4 w-4" />
        Delete
      </button>
    </div>
  );
}