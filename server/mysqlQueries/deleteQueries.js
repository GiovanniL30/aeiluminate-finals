import connection from "../connections.js";
import { account, users } from "../appwriteconfig.js";

/**
 * Removes an account from the user table
 * @affectedDatabase = user
 */
export const removeUserAccount = async (userId) => {
  try {
    const query = "DELETE FROM users WHERE userID = ?";
    const [result] = await connection.query(query, [userId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error Deleting user", error.message);
    throw new Error("Failed to delete user");
  }
};

/**
 * Unlike a post
 * @affectedDatabase = likes
 */
export const unlikePost = async (postID, userID) => {
  const query = "DELETE FROM likes WHERE postID = ? AND userID = ?";

  try {
    const [result] = await connection.query(query, [postID, userID]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error deleting like", err);
    throw new Error("Failed to unlike the post in the database");
  }
};

/**
 * Unfollow a user
 * @affectedDatabase = follower
 */
export const unfollowUser = async (followerID, followedID) => {
  const query = "DELETE FROM follows WHERE followerID = ? AND followedID = ?";

  try {
    const [result] = await connection.query(query, [followerID, followedID]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error unfollowing a user", err);
    throw new Error("Failed to unfollow");
  }
};

/** 
* Delete a post
* @affectedDatabase = posts
*/
export const deletePost = async (postID) => {
  const query = "DELETE FROM posts WHERE postID = ?";

  try{
    const [result] = await connection.query(query, postID);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error deleting the post", err);
    throw new Error("Failed to delete post")
  }

}
