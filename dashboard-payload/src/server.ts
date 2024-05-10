import express from 'express'
import payload from 'payload'
import cors from 'cors'
require('dotenv').config()
import axios from 'axios';
import fs from 'fs';;
import path from 'path';
const app = express()
app.use(cors());
app.use(express.json());
// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})
// Route để lưu ảnh từ URL vào thư mục uploads
// app.post("/api/save-images", async (req, res) => {
//   try {
//     const { images } = req.body;

//     if (!images || !Array.isArray(images)) {
//       return res.status(400).json({ error: "Invalid request" });
//     }

//     for (const image of images) {
//       const { url, filename } = image;

//       // Kiểm tra nếu URL hợp lệ và có tên tệp
//       if (!url || !filename) {
//         continue;
//       }

//       // Tải ảnh từ URL
//       const imageResponse = await axios.get(url, { responseType: "arraybuffer" });

//       // Lưu ảnh vào thư mục uploads
//       fs.writeFileSync(path.join(__dirname, "uploads", filename), imageResponse.data);
//     }

//     res.status(200).json({ message: "Images saved successfully" });
//   } catch (error) {
//     console.error("Error occurred:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
const Payload = require("payload");

app.post("/api/save-images", async (req, res) => {
    try {
        const { images } = req.body;

        if (!images || !Array.isArray(images)) {
            return res.status(400).json({ error: "Invalid request" });
        }

        const savedImages = []; // Array to store saved image data

        for (const image of images) {
            const { url, filename } = image;

            // Kiểm tra nếu URL hợp lệ và có tên tệp
            if (!url || !filename) {
                continue;
            }

            // Tải ảnh từ URL
            const imageResponse = await axios.get(url, { responseType: "arraybuffer" });

            // Lưu ảnh vào thư mục uploads
            const filePath = path.join(__dirname, "uploads", filename);
            fs.writeFileSync(filePath, imageResponse.data);

            // Tạo bản ghi mới trong collection media
            const newMedia = await Payload.create({
                collection: "media",
                data: {
                    filename: filename,
                    alt: filename,
                    // Bạn có thể thêm các trường khác theo yêu cầu của collection `media`
                },
                filePath: filePath,
            });

            // Thêm thông tin về ID của bản ghi vào danh sách
            savedImages.push({
                filename,
                id: newMedia.id, // ID của bản ghi trong collection media
            });
        }

        res.status(200).json({ message: "Images saved successfully", images: savedImages });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  // Add your own express routes here

  app.listen(3000)
}

start()
