const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, "public/asset/uploads");
    },
    filename: function (req, file, cb) {
      const name = file.originalname;
  
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        console.log("hi");
        cb(null, name);
      }
    },
  });
  
  const upload = multer({ storage: storage });
  module.exports={upload}