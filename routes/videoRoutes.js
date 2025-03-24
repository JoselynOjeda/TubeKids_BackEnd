const express = require("express");
const router = express.Router();
const auth = require("../middleware/authenticate");
const videoController = require("../controllers/videoController");

router.post("/", auth, videoController.createVideo);
router.get("/", auth, videoController.getVideos);
router.put("/:id", auth, videoController.updateVideo);
router.delete("/:id", auth, videoController.deleteVideo);

module.exports = router; 
