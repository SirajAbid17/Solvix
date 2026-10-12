const fs = require("fs");
const path = require("path");
const stripComments = require("strip-comments");

const ROOT = process.cwd();

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const ignored = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
]);

function processDirectory(directory) {
  const items = fs.readdirSync(directory, {
    withFileTypes: true,
  });

  for (const item of items) {
    const fullPath = path.join(directory, item.name);

    if (item.isDirectory()) {
      if (!ignored.has(item.name)) {
        processDirectory(fullPath);
      }
      continue;
    }

    if (!extensions.includes(path.extname(item.name))) {
      continue;
    }

    try {
      const original = fs.readFileSync(fullPath, "utf8");

      const cleaned = stripComments(original);

      if (original !== cleaned) {
        fs.writeFileSync(fullPath, cleaned, "utf8");
        console.log(`✓ Comments removed: ${fullPath}`);
      }
    } catch (error) {
      console.log(`✗ Skipped: ${fullPath}`);
      console.log(error.message);
    }
  }
}

processDirectory(ROOT);

console.log("\n✅ Frontend comment removal completed!");