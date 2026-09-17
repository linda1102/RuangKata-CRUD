import multer from "multer";

// Menyimpan file sementara di memory
const storage = multer.memoryStorage();

// Filter file yang diupload
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Hanya menerima file gambar
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan!"));
  }

  // Menampilkan informasi file di terminal
  console.log("Nama file :", file.originalname);
  console.log("MIME type :", file.mimetype);
  console.log("Field     :", file.fieldname);
};

// Konfigurasi multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    // Maksimal ukuran file 5 MB
    fileSize: 5 * 1024 * 1024,
  },
});

// Upload satu file dengan field "image"
export const uploadSingleImage = upload.single("image");
