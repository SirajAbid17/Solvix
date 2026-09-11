// backend/services/agent/utlis/GeneratePdf.js
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

      // ============================================
      // COLORS
      // ============================================
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

      // ============================================
      // PAGE 1 HEADER (Title block)
      // ============================================
      const drawMainHeader = () => {
        // Blue header band
        doc
          .rect(0, 0, PAGE_WIDTH, 90)
          .fill(COLORS.primary);

        // Top accent
        doc
          .rect(0, 0, PAGE_WIDTH, 6)
          .fill(COLORS.accent);

        // Title
        doc
          .fillColor(COLORS.white)
          .fontSize(20)
          .font("Helvetica-Bold")
          .text(title, MARGIN, 30, {
            width: CONTENT_WIDTH,
            align: "left",
            lineGap: 2,
            ellipsis: true,
            height: 30,
          });

        // Subtitle
        if (subtitle) {
          doc
            .fillColor(COLORS.subtitle)
            .fontSize(10)
            .font("Helvetica")
            .text(subtitle, MARGIN, doc.y + 2, {
              width: CONTENT_WIDTH,
              align: "left",
              lineGap: 2,
              ellipsis: true,
              height: 15,
            });
        }

        // "Solvix" tag on right
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

      // ============================================
      // PAGE 2 HEADER (compact)
      // ============================================
      const drawCompactHeader = () => {
        doc
          .fillColor(COLORS.primary)
          .fontSize(9)
          .font("Helvetica-Bold")
          .text("SOLVIX", MARGIN, 20, {
            width: CONTENT_WIDTH / 2,
            align: "left",
          });

        doc
          .fillColor(COLORS.muted)
          .fontSize(9)
          .font("Helvetica")
          .text(title, MARGIN + CONTENT_WIDTH / 2, 20, {
            width: CONTENT_WIDTH / 2,
            align: "right",
            ellipsis: true,
          });

        doc
          .strokeColor(COLORS.border)
          .lineWidth(0.6)
          .moveTo(MARGIN, 33)
          .lineTo(PAGE_WIDTH - MARGIN, 33)
          .stroke();

        doc.y = 45;
      };

      // ============================================
      // SECTION HEADING (compact)
      // ============================================
      const drawHeading = (heading, index) => {
        // Page break check
        if (doc.y > PAGE_HEIGHT - 120) {
          addPage2();
        }

        const startY = doc.y;

        // Number badge
        doc
          .fillColor(COLORS.primary)
          .fontSize(10)
          .font("Helvetica-Bold")
          .text(
            String(index + 1).padStart(2, "0"),
            MARGIN,
            startY + 3,
            { width: 22, align: "left" }
          );

        // Heading
        doc
          .fillColor(COLORS.heading)
          .fontSize(13)
          .font("Helvetica-Bold")
          .text(heading, MARGIN + 26, startY, {
            width: CONTENT_WIDTH - 26,
            align: "left",
            lineGap: 1,
            ellipsis: true,
            height: 20,
          });

        // underline
        doc
          .strokeColor(COLORS.primary)
          .lineWidth(1.5)
          .moveTo(MARGIN + 26, doc.y + 2)
          .lineTo(MARGIN + 80, doc.y + 2)
          .stroke();

        doc.y += 8;
      };

      // ============================================
      // PARAGRAPH (compact, no box)
      // ============================================
      const drawParagraph = (content) => {
        const para = String(content)
          .replace(/\n+/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        if (!para) return;

        const textHeight = doc.heightOfString(para, {
          width: CONTENT_WIDTH,
          lineGap: 3,
          fontSize: 10,
        });

        if (doc.y + textHeight > PAGE_HEIGHT - 50) {
          addPage2();
        }

        doc
          .fillColor(COLORS.text)
          .fontSize(10)
          .font("Helvetica")
          .text(para, MARGIN, doc.y, {
            width: CONTENT_WIDTH,
            align: "justify",
            lineGap: 3,
          });

        doc.y += 6;
      };

      // ============================================
      // BULLET POINTS (compact 2-column style)
      // ============================================
      const drawBullets = (points) => {
        points.forEach((point) => {
          const clean = String(point)
            .replace(/\n+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          if (!clean) return;

          const textWidth = CONTENT_WIDTH - 20;

          const textHeight = doc.heightOfString(clean, {
            width: textWidth,
            lineGap: 2,
            fontSize: 10,
          });

          const rowHeight = textHeight + 4;

          if (doc.y + rowHeight > PAGE_HEIGHT - 50) {
            addPage2();
          }

          const rowY = doc.y;

          // blue dot
          doc
            .circle(MARGIN + 5, rowY + 6, 2.2)
            .fill(COLORS.primary);

          // text
          doc
            .fillColor(COLORS.text)
            .fontSize(10)
            .font("Helvetica")
            .text(clean, MARGIN + 16, rowY, {
              width: textWidth,
              align: "justify",
              lineGap: 2,
            });

          doc.y = rowY + rowHeight + 4;
        });

        doc.y += 4;
      };

      // ============================================
      // DIVIDER
      // ============================================
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

      // ============================================
      // ADD PAGE 2 (if needed)
      // ============================================
      let page2Added = false;
      const addPage2 = () => {
        if (page2Added) return;
        doc.addPage({ size: "A4", margin: MARGIN });
        drawCompactHeader();
        page2Added = true;
      };

      // ============================================
      // BUILD PDF
      // ============================================

      // Page 1 — main header
      drawMainHeader();

      sections.forEach((section, index) => {
        const heading = section?.heading || `Section ${index + 1}`;
        const content = section?.content || "";
        const points = Array.isArray(section?.points) ? section.points : [];

        // heading
        drawHeading(heading, index);

        // paragraph
        if (content && String(content).trim()) {
          drawParagraph(content);
        }

        // bullets
        if (points.length > 0) {
          drawBullets(points);
        }

        // divider
        if (index < sections.length - 1) {
          drawDivider();
        }
      });

      // Empty state
      if (sections.length === 0) {
        doc
          .fillColor(COLORS.text)
          .fontSize(11)
          .font("Helvetica")
          .text("No document sections were generated.", {
            align: "center",
          });
      }

      // ============================================
      // FOOTERS
      // ============================================
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