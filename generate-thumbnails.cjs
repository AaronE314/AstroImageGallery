// generate-thumbnails.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const imagesDir = "./public/images";
const thumbsDir = "./public/images/thumbnails";
if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir);

fs.readdirSync(imagesDir).forEach((file) => {
  if (!file.match(/\.(jpg|jpeg|png)$/i)) return;
  if (fs.existsSync(path.join(thumbsDir, file))) return;
  sharp(path.join(imagesDir, file))
    .resize(400) // width in px
    .toFile(path.join(thumbsDir, file));
});
