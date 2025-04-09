const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Storage for user avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "devconnect/avatars",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// Storage for blog images
const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "devconnect/blogs",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

module.exports = {
  avatar: multer({ storage: avatarStorage }),
  blog: multer({ storage: blogStorage }),
};
