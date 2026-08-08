// components/Resume/CV-Generate/ShowResume.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../BgContext/ThemeContext";
import { getCVById, deleteCV, removeProfileImage } from "../../../Features/CVcreate";
import { toast } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import ResumeFooter from "../ResumeFooter";
import ResumeHeader from "../ResumeHeader";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ResumeContent from "./ResumeContent";
import ResumeActions from "./ResumeActions";

export default function ShowResume() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dark } = useTheme();
  const resumeRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await deleteCV(id);
      toast.success("Resume deleted successfully");
      navigate("/all-resume");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete resume");
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm("Remove profile image?")) return;
    try {
      await removeProfileImage(id);
      toast.success("Image removed successfully");
      loadResume();
    } catch (error) {
      console.error("Remove image error:", error);
      toast.error("Failed to remove image");
    }
  };

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    setDownloading(true);
    try {
      const element = resumeRef.current;
      const clone = element.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.width = "800px";
      clone.style.background = "white";
      clone.style.color = "black";
      clone.style.padding = "50px";
      document.body.appendChild(clone);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 800,
        height: clone.scrollHeight,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      const fullName = resume?.personal?.fullName || resume?.title || "Resume";
      pdf.save(`${fullName}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF Download Error:", error);
      toast.error("Failed to download PDF");
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
    const styles = document.querySelector("style")?.innerHTML || "";
    const fullName = resume?.personal?.fullName || resume?.title || "Resume";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fullName}</title>
          <style>
            ${styles}
            body { 
              padding: 50px; 
              background: white; 
              color: #111827;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 1000px;
              margin: 0 auto;
              line-height: 1.6;
            }
            * { 
              color: #111827 !important;
              background-color: white !important;
              background-image: none !important;
              box-shadow: none !important;
            }
            .resume-card { 
              background: white !important;
              border: none !important;
              padding: 0 !important;
            }
            .section-card {
              background: white !important;
              border: none !important;
              padding: 0 !important;
              margin-bottom: 24px !important;
            }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            .text-gray-400 { color: #9ca3af !important; }
            .text-blue-600 { color: #2563eb !important; }
            a { color: #2563eb !important; text-decoration: none !important; }
            .border-b { border-bottom: 2px solid #e5e7eb !important; }
            .border-gray-200 { border-color: #e5e7eb !important; }
            .shadow-lg { box-shadow: none !important; }
            .shadow-sm { box-shadow: none !important; }
            .skill-chip {
              background: #f3f4f6 !important;
              color: #111827 !important;
              border-radius: 9999px !important;
              padding: 4px 16px !important;
              display: inline-block !important;
              margin: 4px !important;
              font-size: 13px !important;
            }
            .section-heading {
              font-size: 22px !important;
              font-weight: 700 !important;
              border-bottom: 2px solid #e5e7eb !important;
              padding-bottom: 8px !important;
              margin-bottom: 16px !important;
              text-transform: uppercase !important;
              letter-spacing: 1px !important;
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 1000);
            }
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
          <p className="text-lg font-semibold text-gray-700">Loading resume...</p>
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
      <div className={`min-h-screen p-4 md:p-8 ${dark ? "bg-black" : "bg-gray-50"}`}>
        <div className="mx-auto max-w-5xl">
          <ResumeActions
            id={id}
            onEdit={() => navigate(`/edit-resume/${id}`)}
            onPrint={handlePrint}
            onDownload={downloadPDF}
            onDelete={handleDelete}
            onRemoveImage={handleRemoveImage}
            hasProfileImage={!!resume.profileImage?.url}
            downloading={downloading}
          />

          <div ref={resumeRef} className="resume-card rounded-2xl bg-white p-8 md:p-10 shadow-lg">
            <ResumeContent resume={resume} />
          </div>
        </div>
      </div>
      <ResumeFooter />
    </>
  );
}