const express = require("express");
const router = express.Router();
const { getVideos, createVideo, updateVideo, deleteVideo, getVideoById } = require("../controllers/videoController");


router.get("/", getVideos);
router.post("/", createVideo);
router.get("/:id", getVideoById);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

module.exports = router;
