import { ID, InputFile } from "node-appwrite";
import crypto from "crypto";

import { storage } from "../appwriteconfig.js";

import { addNewPost, addNewMedia, addLike } from "../mysqlQueries/addQueries.js";
import { getPosts, getMedia, getPostStats } from "../mysqlQueries/readQueries.js";
import { unlikePost } from "../mysqlQueries/deleteQueries.js";

/**
 *
 * Inserts a new Post on the Database
 *
 * @method POST
 * @route /api/post
 */
export const uploadPostController = async (req, res) => {
  try {
    const { userId } = req;
    const { caption } = req.body;
    const postId = crypto.randomUUID();

    const mediaInfo = [];

    for (const file of req.files) {
      const result = await storage.createFile(process.env.APP_WRITE_IMAGES_BUCKET, ID.unique(), InputFile.fromBuffer(file.buffer, file.originalname));

      const mediaURL = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.APP_WRITE_IMAGES_BUCKET}/files/${result.$id}/view?project=${process.env.APP_WRITE_PROJECT_ID}&project=${process.env.APP_WRITE_PROJECT_ID}&mode=admin`;

      mediaInfo.push({
        mediaID: result.$id,
        mediaType: file.mimetype,
        mediaURL,
      });
    }

    const postResult = await addNewPost(postId, userId, caption, new Date());
    if (!postResult) throw new Error("Failed to add new post");

    for (const media of mediaInfo) {
      const newMedia = await addNewMedia(media.mediaID, media.mediaType, media.mediaURL, new Date(), postId);
      if (!newMedia) throw new Error("Failed to add new media");
    }

    return res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error in uploadPostController:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

/**
 *
 * Inserts a new aeline on the Database
 *
 * @method POST
 * @route /api/line
 */
export const uploadLineController = async (req, res, next) => {
  try {
    const { userId } = req;
    const { caption } = req.body;
    const postId = crypto.randomUUID();

    const postResult = await addNewPost(postId, userId, caption, new Date());
    if (!postResult) throw new Error("Failed to add new post");

    return res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error in uploadLineController:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

/**
 *
 * Get list of Posts on the Database
 *
 * paginated list of posts
 *
 * @method GET
 * @route /api/post
 */
export const getPostController = async (req, res, next) => {
  try {
    const { userId } = req;
    const { page, length } = req.query;

    const { posts, total } = await getPosts(page, length, userId);

    const updatedPosts = [];

    for (const post of posts) {
      const postMedia = await getMedia(post.postID);
      updatedPosts.push({ ...post, postMedia });
    }

    const totalPage = Math.ceil(total / length);

    res.status(200).json({
      posts: updatedPosts,
      totatPosts: total,
      totalPage,
    });
  } catch (error) {
    console.error("Error in getting posts:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

/**
 *
 * Get Comment and Like Count of a post
 *
 *
 * @method GET
 * @route /api/post/stats/:id
 */
export const getPostCommentAndLikeCountController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const stats = await getPostStats(id);

    if (!stats) return res.status(404).json({ message: "Post stats not found" });

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error in getting post comment and like:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

/**
 *
 * Like a post
 *
 *
 * @method GET
 * @route /api/post/like/:id
 */
export const likeController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const result = await addLike(id, userId);

    if (!result) throw new Error("Failed to like the post");

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in liking the post:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

/**
 *
 * Unline a post
 *
 *
 * @method GET
 * @route /api/post/unlike/:id
 */
export const unlikeController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const result = await unlikePost(id, userId);

    if (!result) throw new Error("Failed to unlike the post");

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in unliking the post:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
