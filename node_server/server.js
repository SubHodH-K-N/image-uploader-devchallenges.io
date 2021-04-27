require("dotenv").config({ path: "./env/config.env" });

const express = require("express");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

app.post("/images", async (req, res) => {
  let result = await cloudinary.uploader.upload(req.body.image);
  res.send({ url: result.secure_url });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT=${PORT}`);
});
