import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../BgContext/ThemeContext";
import {
  getCVById,
  deleteCV,
  removeProfileImage,
} from "../../../Features/CVcreate";
import { toast } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import ResumeFooter from "../ResumeFooter";
import ResumeHeader from "../ResumeHeader";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import ResumeContent from "./ResumeContent";
import ResumeActions from "./ResumeActions";
import ConfirmDialog from "../ConfirmDialog";

export default function ShowResume() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dark } = useTheme();
  const resumeRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

 
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    loading: false,
  });

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    try {
      setLoading(true);
      const response = await getCVById(id);
      setResume(response.data);
    } catch (err) {
      toast.error("Failed to load resume");
      setError("Failed to load resume");
    } finally {
      setLoading(false);
    }
  };

  
  const handleDeleteClick = () => {
    setConfirmDialog({
      open: true,
      type: "delete",
      loading: false,
    });
  };


  const handleRemoveImageClick = () => {
    setConfirmDialog({
      open: true,
      type: "removeImage",
      loading: false,
    });
  };

  
  const handleConfirmAction = async () => {
    const { type } = confirmDialog;
    setConfirmDialog((prev) => ({ ...prev, loading: true }));

    try {
      if (type === "delete") {
        await deleteCV(id);
        toast.success("Resume deleted successfully");
        setConfirmDialog({ open: false, type: null, loading: false });
        navigate("/all-resume");
      } else if (type === "removeImage") {
        await removeProfileImage(id);
        toast.success("Image removed successfully");
        setConfirmDialog({ open: false, type: null, loading: false });
        loadResume();
      }
    } catch (err) {
      console.error("Action error:", err);
      toast.error(
        type === "delete"
          ? "Failed to delete resume"
          : "Failed to remove image",
      );
      setConfirmDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleCancelAction = () => {
    if (confirmDialog.loading) return;
    setConfirmDialog({ open: false, type: null, loading: false });
  };

  
  const imageToBase64 = async (url) => {
    try {
      const response = await fetch(url, {
        mode: "cors",
        credentials: "omit",
      });
      if (!response.ok) throw new Error("Image fetch failed");
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn("Base64 conversion failed for:", url, err.message);
      return null;
    }
  };

  const downloadPDF = async () => {
    if (!resumeRef.current) {
      toast.error("Resume not ready");
      return;
    }

    setDownloading(true);
    const toastId = toast.loading("Generating PDF...");

    try {
      const profileImageUrl = resume?.profileImage?.url;
      let profileImageBase64 = null;

      if (profileImageUrl) {
        toast.loading("Loading profile image...", { id: toastId });
        profileImageBase64 = await imageToBase64(profileImageUrl);
      }

      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        windowWidth: 794,
        imageTimeout: 15000,
        onclone: (clonedDoc, element) => {
          clonedDoc.documentElement.classList.remove("dark");
          clonedDoc.body.classList.remove("dark");

          element.style.padding = "40px";
          element.style.background = "#ffffff";
          element.style.color = "#111827";
          element.style.boxShadow = "none";
          element.style.borderRadius = "0";
          element.style.width = "794px";
          element.style.margin = "0";
          element.style.position = "relative";
          element.style.top = "0";
          element.style.left = "0";

          const images = element.querySelectorAll("img");
          images.forEach((img) => {
            if (
              profileImageBase64 &&
              (img.src.includes("cloudinary") ||
                img.src.includes("res.cloudinary") ||
                img.src === profileImageUrl)
            ) {
              img.src = profileImageBase64;
              img.crossOrigin = "anonymous";
            }

            img.style.maxWidth = "144px";
            img.style.width = "144px";
            img.style.height = "144px";
            img.style.maxHeight = "144px";
            img.style.objectFit = "cover";
            img.style.objectPosition = "center";
            img.style.borderRadius = "9999px";
            img.style.border = "4px solid #e5e7eb";
            img.style.display = "block";
            img.style.flexShrink = "0";
          });

          const allElements = element.querySelectorAll("*");
          allElements.forEach((el) => {
            try {
              const style = clonedDoc.defaultView.getComputedStyle(el);
              if (style.color && style.color.includes("oklch")) {
                el.style.color = "#111827";
              }
              if (
                style.backgroundColor &&
                style.backgroundColor.includes("oklch")
              ) {
                const bg = style.backgroundColor;
                if (!bg.includes("rgba(0, 0, 0, 0)")) {
                  el.style.backgroundColor = "#ffffff";
                }
              }
              if (style.borderColor && style.borderColor.includes("oklch")) {
                el.style.borderColor = "#e5e7eb";
              }
            } catch (e) {}
          });

          element.querySelectorAll("a").forEach((a) => {
            a.style.color = "#2563eb";
            a.style.textDecoration = "none";
          });
        },
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("Canvas is empty — render fail");
      }

      toast.loading("Generating PDF...", { id: toastId });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        position,
        imgWidth,
        imgHeight,
        "",
        "FAST",
      );
      heightLeft -= pdfPageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          position,
          imgWidth,
          imgHeight,
          "",
          "FAST",
        );
        heightLeft -= pdfPageHeight;
      }

      const fullName =
        resume?.personal?.fullName?.trim() || resume?.title?.trim() || "Resume";
      const safeName = fullName.replace(/[^a-zA-Z0-9_-]/g, "_");
      pdf.save(`${safeName}_SIRAJ_ABID.pdf`);

      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("PDF Download Error:", error);
      toast.error("Failed to download PDF: " + error.message, { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print");
      return;
    }

    const content = resumeRef.current;
    const fullName = resume?.personal?.fullName || resume?.title || "Resume";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fullName}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              padding: 40px;
              background: white;
              color: #111827;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 900px;
              margin: 0 auto;
              line-height: 1.6;
              font-size: 14px;
            }
            img { 
              max-width: 144px; 
              width: 144px;
              height: 144px;
              object-fit: cover;
              border-radius: 9999px;
              border: 4px solid #e5e7eb;
            }
            a { color: #2563eb; text-decoration: none; }
            h1, h2, h3, h4 { margin: 0.5em 0; }
            .section-card { margin-bottom: 20px; }
            .section-heading {
              font-size: 20px;
              font-weight: 700;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 6px;
              margin-bottom: 12px;
              text-transform: uppercase;
            }
            .skill-chip {
              background: #f3f4f6;
              color: #111827;
              border-radius: 9999px;
              padding: 3px 12px;
              display: inline-block;
              margin: 3px;
              font-size: 12px;
            }
            @page { margin: 15mm; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="mb-4 h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-lg font-semibold text-gray-700">
            Loading resume...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">{error}</p>
          <button
            onClick={loadResume}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Resume not found</p>
      </div>
    );
  }

  return (
    <>
      <ResumeHeader />
      <div
        className={`min-h-screen p-4 md:p-8 ${
          dark ? "bg-black" : "bg-gray-50"
        }`}
      >
        <div className="mx-auto max-w-5xl">
          <ResumeActions
            id={id}
            onEdit={() => navigate(`/edit-resume/${id}`)}
            onPrint={handlePrint}
            onDownload={downloadPDF}
            onDelete={handleDeleteClick} // ✅ changed
            onRemoveImage={handleRemoveImageClick} // ✅ changed
            hasProfileImage={!!resume.profileImage?.url}
            downloading={downloading}
          />

          <div
            ref={resumeRef}
            className="resume-card rounded-2xl bg-white p-8 md:p-10 shadow-lg"
            style={{ color: "#111827", backgroundColor: "#ffffff" }}
          >
            <ResumeContent resume={resume} />
          </div>
        </div>
      </div>
      <ResumeFooter />

      
      <ConfirmDialog
        open={confirmDialog.open && confirmDialog.type === "delete"}
        title="Delete Resume?"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        dark={dark}
        loading={confirmDialog.loading}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />

     
      <ConfirmDialog
        open={confirmDialog.open && confirmDialog.type === "removeImage"}
        title="Remove Profile Image?"
        message="Are you sure you want to remove the profile image from this resume?"
        confirmText="Remove Image"
        cancelText="Cancel"
        variant="warning"
        dark={dark}
        loading={confirmDialog.loading}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </>
  );
}
