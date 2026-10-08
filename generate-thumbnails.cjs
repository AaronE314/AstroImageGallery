// generate-thumbnails.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const imagesDir = "./public/images";
const thumbsDir = "./public/images/thumbnails";
if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir);

fs.readdirSync(imagesDir).forEach((file) => {
  const lower = file.toLowerCase();
  // image files
  if (lower.match(/\.(jpg|jpeg|png)$/i)) {
    if (fs.existsSync(path.join(thumbsDir, file))) return;
    sharp(path.join(imagesDir, file))
      .resize(400) // width in px
      .toFile(path.join(thumbsDir, file));
    return;
  }

  // video files (mp4) - use ffmpeg to extract first good frame
  if (lower.match(/\.mp4$/i)) {
    const outName = path.basename(file, path.extname(file)) + ".jpg";
    const outPath = path.join(thumbsDir, outName);
    if (fs.existsSync(outPath)) return;

    // try to run ffmpeg if available
    try {
      // capture at 0.05s to avoid black first frames
      const spawnSync = require("child_process").spawnSync;
      const ff = spawnSync("ffmpeg", [
        "-y",
        "-i",
        path.join(imagesDir, file),
        "-ss",
        "00:00:00.050",
        "-vframes",
        "1",
        "-q:v",
        "2",
        outPath,
      ]);

      if (ff.error || ff.status !== 0) {
        console.error("ffmpeg thumbnail generation failed for", file, ff.error || ff.stderr && ff.stderr.toString());
        // fallback: leave no thumbnail
      } else {
        console.log("generated thumbnail for", file, "->", outName);
      }
    } catch (e) {
      console.error("failed to run ffmpeg for", file, e);
    }
    // Additionally, create a web-friendly H.264 variant for broader browser support (Chrome)
    try {
      const spawnSync = require("child_process").spawnSync;
      const base = path.basename(file, path.extname(file));
      const webOut = path.join(imagesDir, base + "-web.mp4");
      if (!fs.existsSync(webOut)) {
        const trans = spawnSync("ffmpeg", [
          "-y",
          "-i",
          path.join(imagesDir, file),
          "-c:v",
          "libx264",
          "-preset",
          "medium",
          "-crf",
          "20",
          "-pix_fmt",
          "yuv420p",
          "-movflags",
          "+faststart",
          "-c:a",
          "aac",
          "-b:a",
          "128k",
          webOut,
        ]);

        if (trans.error || trans.status !== 0) {
          console.error("ffmpeg transcode failed for", file, trans.error || trans.stderr && trans.stderr.toString());
        } else {
          console.log("generated web mp4 for", file, "->", path.basename(webOut));
        }
      }
    } catch (e) {
      console.error("failed to transcode mp4 for web", file, e);
    }
    return;
  }
});
