import PDFDocument from "pdfkit";

const generatePdf = async (data) => {
  return new Promise((resolve, reject) => {
    try {
     
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,

        info: {
          Author: "Solvix",
          Title: data?.title || "Solvix Document",
          Creator: "Solvix",
          Subject: data?.subtitle || "Generated Document",
        },

        bufferPages: true,
      });

      
      const chunks = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

    
      doc.on("end", () => {
        try {
          const buffer = Buffer.concat(chunks);

         

          resolve(buffer);
        } catch (error) {
          reject(error);
        }
      });

     
      doc.on("error", (error) => {
        
        reject(error);
      });

      
      const title =
        data?.title ||
        "Solvix Document";

      const subtitle =
        data?.subtitle ||
        "";

      const sections =
        Array.isArray(data?.sections)
          ? data.sections
          : [];

     

      
      const COLORS = {
        title: "#111827",
        heading: "#111827",
        text: "#374151",
        subtitle: "#4B5563",
        muted: "#6B7280",
        line: "#D1D5DB",
        bullet: "#374151",
      };

      doc
        .fillColor(COLORS.title)
        .fontSize(26)
        .font("Helvetica-Bold")
        .text(title, {
          align: "center",
          lineGap: 5,
        });

      
      if (subtitle) {
        doc.moveDown(0.7);

        doc
          .fillColor(COLORS.subtitle)
          .fontSize(12)
          .font("Helvetica")
          .text(String(subtitle), {
            align: "center",
            lineGap: 4,
          });
      }

      doc.moveDown(1);

      doc
        .strokeColor(COLORS.line)
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke();

      doc.moveDown(1.5);

      sections.forEach((section, sectionIndex) => {
        const heading =
          section?.heading ||
          `Section ${sectionIndex + 1}`;

        const sectionContent =
          section?.content ||
          "";

        const points =
          Array.isArray(section?.points)
            ? section.points
            : [];

      

        
        doc
          .fillColor(COLORS.heading)
          .fontSize(18)
          .font("Helvetica-Bold")
          .text(heading, {
            align: "left",
            lineGap: 3,
          });

        doc.moveDown(0.5);

       

        if (
          sectionContent &&
          String(sectionContent).trim()
        ) {
          const content =
            String(sectionContent).trim();

          
          const paragraphs =
            content.split(/\n\s*\n/);

          paragraphs.forEach((paragraph) => {
            const cleanParagraph =
              paragraph
                .replace(/\n+/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            if (!cleanParagraph) {
              return;
            }

            doc
              .fillColor(COLORS.text)
              .fontSize(11.5)
              .font("Helvetica")
              .text(cleanParagraph, {
                align: "left",
                lineGap: 5,
                paragraphGap: 8,
              });

            doc.moveDown(0.4);
          });

          doc.moveDown(0.4);
        }

        points.forEach((point) => {
          if (
            point === null ||
            point === undefined
          ) {
            return;
          }

          const cleanPoint =
            String(point)
              .replace(/\n+/g, " ")
              .replace(/\s+/g, " ")
              .trim();

          if (!cleanPoint) {
            return;
          }

          doc
            .fillColor(COLORS.bullet)
            .fontSize(11)
            .font("Helvetica")
            .text(`• ${cleanPoint}`, {
              align: "left",
              lineGap: 4,
              indent: 12,
              hanging: 5,
              paragraphGap: 5,
            });

          doc.moveDown(0.25);
        });

        
        doc.moveDown(1);

        if (
          sectionIndex <
          sections.length - 1
        ) {
          doc
            .strokeColor(COLORS.line)
            .lineWidth(0.5)
            .moveTo(50, doc.y)
            .lineTo(
              doc.page.width - 50,
              doc.y
            )
            .stroke();

          doc.moveDown(1);
        }
      });

      if (sections.length === 0) {
        doc
          .fillColor(COLORS.text)
          .fontSize(12)
          .font("Helvetica")
          .text(
            "No document sections were generated.",
            {
              align: "center",
            }
          );

        doc.moveDown(1);
      }

      const pageRange =
        doc.bufferedPageRange();

      for (
        let i = 0;
        i < pageRange.count;
        i++
      ) {
        doc.switchToPage(
          pageRange.start + i
        );

        const pageNumber = i + 1;
        const totalPages =
          pageRange.count;

        const footerY =
          doc.page.height - 35;

        doc
          .save()
          .fillColor(COLORS.muted)
          .fontSize(9)
          .font("Helvetica")
          .text(
            `Generated By Solvix • Siraj Abid`,
            50,
            footerY,
            {
              width:
                doc.page.width - 100,
              align: "center",
            }
          )
          .text(
            `Page ${pageNumber} of ${totalPages}`,
            50,
            footerY + 12,
            {
              width:
                doc.page.width - 100,
              align: "center",
            }
          )
          .restore();
      }

      doc.end();

    } catch (error) {
      

      reject(error);
    }
  });
};

export default generatePdf;