import { ID, InputFile } from "node-appwrite";
import crypto from "crypto";
import { storage } from "../appwriteconfig.js";
import { addNewPost, addNewMedia, addLike, addComment, createAlbum } from "../mysqlQueries/addQueries.js";
import { getPosts, getMedia, getPostStats, getPostComments, getUserPosts } from "../mysqlQueries/readQueries.js";
import { unlikePost, deletePost } from "../mysqlQueries/deleteQueries.js";

/**
 * Inserts a new Post on the Database
 */
export const uploadPostController = async (req, res) => {
  try {
    const { userId, mediaInfo } = req;

    const { caption, albumTitle, albumId } = req.body;
    const postId = crypto.randomUUID();

    if (albumId && albumTitle) {
      const albumResult = await createAlbum(albumId, albumTitle, userId);
      if (!albumResult) throw new Error("Failed to create album");
    }

    const postResult = await addNewPost(postId, userId, caption, new Date(), albumId);
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
 * @route /api/posts
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
      totalPosts: total,
      totalPage,
    });
  } catch (error) {
    console.error("Error in getting posts:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

/**
 *
 * Get list of Posts of a user on the Database
 *
 *
 * @method GET
 * @route /api/posts/:id
 */
export const getUserPostsController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const posts = await getUserPosts(id);

    const updatedPosts = [];

    for (const post of posts) {
      const postMedia = await getMedia(post.postID);
      updatedPosts.push({ ...post, postMedia });
    }

    res.status(200).json({ posts: updatedPosts });
  } catch (error) {
    console.error("Error in getting user posts:", error);
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
    const { userId } = req;

    const stats = await getPostStats(id, userId);

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
 * Unlike a post
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

/**
 *
 * Get post comments
 *
 *
 * @method GET
 * @route /post/comments/:id
 */
export const getCommentsController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await getPostComments(id);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in adding comment to the post:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

/**
 *
 * Add a comment
 *
 *
 * @method POST
 * @route /post/comment/:id
 */
export const addCommentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const { comment } = req.body;

    if (!comment) return res.status(401).json({ message: "Comment must not be blank" });

    const result = await addComment(crypto.randomUUID(), comment, id, userId);

    if (!result) throw new Error("Failed to add comment");

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in adding comment to the post:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

/**
 *
 * Delete a post
 *
 *
 * @method GET
 */
 export const deletePostController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const result = await deletePost(id, userId);

    if (!result) throw new Error("Failed to delete the post");

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in deleting the post:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};