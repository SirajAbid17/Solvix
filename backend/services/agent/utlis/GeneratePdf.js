import PDFDocument from "pdfkit";

const generatePdf = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 35,
        info: {
          Author: "Solvix",
          Title: data?.title || "Solvix Document",
          Creator: "Solvix",
          Subject: data?.subtitle || "Generated Document",
        },
        bufferPages: true,
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        try {
          resolve(Buffer.concat(chunks));
        } catch (error) {
          reject(error);
        }
      });
      doc.on("error", (error) => reject(error));

      const COLORS = {
        primary: "#2563EB",
        primaryDark: "#1D4ED8",
        secondary: "#0F172A",
        text: "#334155",
        light: "#F8FAFC",
        lighter: "#EFF6FF",
        border: "#E2E8F0",
        white: "#FFFFFF",
        muted: "#64748B",
        accent: "#60A5FA",
        subtitle: "#DBEAFE",
        heading: "#2563EB",
      };

      const title = data?.title || "Solvix Document";
      const subtitle = data?.subtitle || "";
      const sections = Array.isArray(data?.sections) ? data.sections : [];

      const PAGE_WIDTH = doc.page.width;
      const PAGE_HEIGHT = doc.page.height;
      const MARGIN = 35;
      const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

     
      const cleanText = (text) => {
        if (!text) return "";
        return String(text)
          .replace(/\r\n/g, "\n")
          .replace(/\r/g, "\n")
       
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .replace(/^#{1,6}\s+/gm, "")
          .replace(/^[-*•]\s+/gm, "")
          .replace(/`{1,3}(.*?)`{1,3}/g, "$1")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          
          .replace(/<br\s*\/?>/gi, " ")
          .replace(/<\/?[a-z][^>]*>/gi, "")
          .replace(/&nbsp;/gi, " ")
          .replace(/&amp;/gi, "&")
          .replace(/&lt;/gi, "<")
          .replace(/&gt;/gi, ">")
          .replace(/&quot;/gi, '"')
          .replace(/&#39;/gi, "'")
          
          .replace(/[ \t]+/g, " ")
          .replace(/[ \t]+\n/g, "\n")
          .replace(/\n[ \t]+/g, "\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
      };

      
      const drawMainHeader = () => {
        doc.rect(0, 0, PAGE_WIDTH, 90).fill(COLORS.primary);
        doc.rect(0, 0, PAGE_WIDTH, 6).fill(COLORS.accent);

        doc
          .fillColor(COLORS.white)
          .fontSize(20)
          .font("Helvetica-Bold")
          .text(cleanText(title), MARGIN, 30, {
            width: CONTENT_WIDTH,
            align: "left",
            lineGap: 2,
            ellipsis: true,
          });

        if (subtitle) {
          doc
            .fillColor(COLORS.subtitle)
            .fontSize(10)
            .font("Helvetica")
            .text(cleanText(subtitle), MARGIN, doc.y + 4, {
              width: CONTENT_WIDTH,
              align: "left",
              lineGap: 2,
              ellipsis: true,
            });
        }

        doc
          .fillColor(COLORS.white)
          .fontSize(9)
          .font("Helvetica-Bold")
          .text("SOLVIX", MARGIN, 12, {
            width: CONTENT_WIDTH,
            align: "right",
          });

        doc.y = 110;
      };

     
      const drawCompactHeader = () => {
        doc
          .fillColor(COLORS.primary)
          .fontSize(9)
          .font("Helvetica-Bold")
          .text("SOLVIX", MARGIN, 20, {
            width: CONTENT_WIDTH / 2,
            align: "left",
            lineBreak: false,
          });

        doc
          .fillColor(COLORS.muted)
          .fontSize(9)
          .font("Helvetica")
          .text(title, MARGIN + CONTENT_WIDTH / 2, 20, {
            width: CONTENT_WIDTH / 2,
            align: "right",
            ellipsis: true,
            lineBreak: false,
          });

        doc
          .strokeColor(COLORS.border)
          .lineWidth(0.6)
          .moveTo(MARGIN, 33)
          .lineTo(PAGE_WIDTH - MARGIN, 33)
          .stroke();

        doc.y = 45;
      };

    
      const addNewPage = () => {
        doc.addPage({ size: "A4", margin: MARGIN });
        drawCompactHeader();
      };

      
      const drawHeading = (heading, index) => {
        
        if (doc.y > PAGE_HEIGHT - 100) {
          addNewPage();
        }

        const startY = doc.y;

        doc
          .fillColor(COLORS.primary)
          .fontSize(10)
          .font("Helvetica-Bold")
          .text(String(index + 1).padStart(2, "0"), MARGIN, startY + 3, {
            width: 22,
            align: "left",
            lineBreak: false,
          });

        doc
          .fillColor(COLORS.heading)
          .fontSize(13)
          .font("Helvetica-Bold")
          .text(cleanText(heading), MARGIN + 26, startY, {
            width: CONTENT_WIDTH - 26,
            align: "left",
            lineGap: 1,
            ellipsis: true,
          });

        
        const underlineY = doc.y + 3;
        doc
          .strokeColor(COLORS.primary)
          .lineWidth(1.5)
          .moveTo(MARGIN + 26, underlineY)
          .lineTo(MARGIN + 80, underlineY)
          .stroke();

        doc.y = underlineY + 8;
      };

     
      const drawParagraph = (content) => {
        const para = cleanText(content).replace(/\n+/g, " ").trim();
        if (!para) return;

        const textHeight = doc.heightOfString(para, {
          width: CONTENT_WIDTH,
          lineGap: 3,
          fontSize: 10,
        });

        if (doc.y + textHeight > PAGE_HEIGHT - 50) {
          addNewPage();
        }

        doc
          .fillColor(COLORS.text)
          .fontSize(10)
          .font("Helvetica")
          .text(para, MARGIN, doc.y, {
            width: CONTENT_WIDTH,
            align: "left",         
            lineGap: 3,
          });

        doc.y += 8;
      };

     
      const drawBullets = (points) => {
        points.forEach((point) => {
          const clean = cleanText(point).replace(/\n+/g, " ").trim();
          if (!clean) return;

          const textWidth = CONTENT_WIDTH - 20;

          const textHeight = doc.heightOfString(clean, {
            width: textWidth,
            lineGap: 2,
            fontSize: 10,
          });

          const rowHeight = textHeight + 6;

          if (doc.y + rowHeight > PAGE_HEIGHT - 50) {
            addNewPage();
          }

          const rowY = doc.y;

          doc.circle(MARGIN + 5, rowY + 6, 2.2).fill(COLORS.primary);

          doc
            .fillColor(COLORS.text)
            .fontSize(10)
            .font("Helvetica")
            .text(clean, MARGIN + 16, rowY, {
              width: textWidth,
              align: "left",      
              lineGap: 2,
            });

          doc.y = rowY + rowHeight + 4;
        });

        doc.y += 4;
      };

     
      const drawDivider = () => {
        if (doc.y > PAGE_HEIGHT - 70) return;
        doc
          .strokeColor(COLORS.border)
          .lineWidth(0.4)
          .moveTo(MARGIN, doc.y)
          .lineTo(PAGE_WIDTH - MARGIN, doc.y)
          .stroke();
        doc.y += 8;
      };

     
      drawMainHeader();

      sections.forEach((section, index) => {
        const heading = section?.heading || `Section ${index + 1}`;
        const content = section?.content || "";
        const points = Array.isArray(section?.points) ? section.points : [];

        drawHeading(heading, index);

        if (content && String(content).trim()) {
          drawParagraph(content);
        }

        if (points.length > 0) {
          drawBullets(points);
        }

        if (index < sections.length - 1) {
          drawDivider();
        }
      });

      if (sections.length === 0) {
        doc
          .fillColor(COLORS.text)
          .fontSize(11)
          .font("Helvetica")
          .text("No document sections were generated.", {
            align: "center",
          });
      }

      
      const pageRange = doc.bufferedPageRange();
      const totalPages = pageRange.count;

      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(pageRange.start + i);

        const pageNumber = i + 1;
        const footerY = PAGE_HEIGHT - 25;

        doc
          .strokeColor(COLORS.border)
          .lineWidth(0.4)
          .moveTo(MARGIN, footerY - 8)
          .lineTo(PAGE_WIDTH - MARGIN, footerY - 8)
          .stroke();

        doc
          .fillColor(COLORS.muted)
          .fontSize(8)
          .font("Helvetica")
          .text("Generated by Solvix", MARGIN, footerY, {
            width: CONTENT_WIDTH / 2,
            align: "left",
            lineBreak: false,
          });

        doc
          .fillColor(COLORS.muted)
          .fontSize(8)
          .font("Helvetica")
          .text(
            `Page ${pageNumber} of ${totalPages}`,
            MARGIN + CONTENT_WIDTH / 2,
            footerY,
            {
              width: CONTENT_WIDTH / 2,
              align: "right",
              lineBreak: false,
            }
          );
      }

      doc.end();
    } catch (error) {
      console.error("PDF generate error:", error);
      reject(error);
    }
  });
};

export default generatePdf;