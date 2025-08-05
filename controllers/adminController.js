const fs = require("fs");
const yaml = require("js-yaml"); // For YAML parsing (install with `npm install js-yaml`)

const uploadSwaggerHandler = (req, res) => {
  try {
    // Case 1: Raw pasted text (application/json)
    if (req.body.swaggerText) {
      const text = req.body.swaggerText;

      try {
        // Try parsing JSON first
        JSON.parse(text);
        return res.json({ message: "Valid Swagger JSON received" });
      } catch {
        try {
          yaml.load(text);
          return res.json({ message: "Valid Swagger YAML received" });
        } catch {
          return res.status(400).json({ message: "Invalid Swagger YAML/JSON" });
        }
      }
    }

    // Case 2: File upload (multipart/form-data)
    if (req.file) {
      const fileContent = fs.readFileSync(req.file.path, "utf8");

      try {
        // Try JSON
        JSON.parse(fileContent);
        return res.json({ message: "Valid Swagger JSON file uploaded" });
      } catch {
        try {
          yaml.load(fileContent);
          return res.json({ message: "Valid Swagger YAML file uploaded" });
        } catch {
          return res.status(400).json({ message: "Invalid Swagger YAML/JSON file" });
        }
      }
    }

    return res.status(400).json({ message: "No Swagger input provided" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {uploadSwaggerHandler};