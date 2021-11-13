const express = require("express");
const router = express.Router();
const service = require("./service");

const bucketName = "miloud-bucket";
const filePath = "/home/cy/Downloads/sample.jpeg";

router.get("/", async (req, res) => {
  const result = await service.uploadFile(filePath, bucketName);
  res.json(result);
});

module.exports = router;
