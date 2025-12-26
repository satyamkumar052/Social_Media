import { Router } from "express";
import * as PostController from "../controller/posts.controller.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });

router.get("/", PostController.activeCheck);

router.post("/post", upload.single("media"), PostController.createPost);
router.get("/posts", PostController.getAllPosts);
router.delete("/delete_post", PostController.deletePost);

router.post("/comment", PostController.commentPost);
router.get("/get_comments", PostController.get_comments_by_post);
router.delete("/delete_comment", PostController.delete_comment_of_user);

router.post("/increment_post_like", PostController.increment_likes);

export default router;
