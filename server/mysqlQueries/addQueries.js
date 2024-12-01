import connection from "../connections.js";
import { account, users } from "../appwriteconfig.js";

/**
 * Adds a new user
 * @affectedDatabase = user
 */
export const addNewUser = async (userId, role, email, username, password, firstName, middleName, lastName) => {
  const insertUserQuery = `
    INSERT INTO users (userID, role, email, username, password, firstName, middleName, lastName) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await connection.query(insertUserQuery, [userId, role, email, username, password, firstName, middleName, lastName]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error inserting new user:", err);
    throw new Error("Failed to insert new user into the database");
  }
};

/**
 * Adds a new alumni
 * @affectedDatabase = alumni
 */
export const addNewAlumni = async (userID, yeaGraduated, programID) => {
  const insertUserQuery = `
    INSERT INTO alumni (userID, year_graduated, programID) 
    VALUES (?, ?, ?)
  `;

  try {
    const [result] = await connection.query(insertUserQuery, [userID, yeaGraduated, programID]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error inserting new alumni", err);
    throw new Error("Failed to insert new alumni into the database");
  }
};

/**
 * Adds a new post
 * @affectedDatabase = posts
 */
export const addNewPost = async (postId, userID, caption, time) => {
  const query = "INSERT INTO posts (postId, userID, caption, createdAt) VALUES (?, ?, ?, ?)";

  try {
    const [result] = await connection.query(query, [postId, userID, caption, time]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error inserting new post", err);
    throw new Error("Failed to insert new post into the database");
  }
};

/**
 * Adds a new media
 * @affectedDatabase = media
 */
export const addNewMedia = async (mediaID, mediaType, mediaURL, uploadedAt, postID) => {
  const query = "INSERT INTO media (mediaID, mediaType, mediaURL, uploadedAt, postID) VALUES (?, ?, ?, ?, ?)";

  try {
    const [result] = await connection.query(query, [mediaID, mediaType, mediaURL, uploadedAt, postID]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error inserting new media", err);
    throw new Error("Failed to insert new media into the database");
  }
};

/**
 * Like a new post
 * @affectedDatabase = likes
 */
export const addLike = async (postID, userID) => {
  const query = "INSERT INTO likes (postID, userID, likedAt) VALUES (?, ?, ?)";

  try {
    const [result] = await connection.query(query, [postID, userID, new Date()]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error inserting new like", err);
    throw new Error("Failed to insert new like into the database");
  }
};

/**
 * Follow a user
 * @affectedDatabase = follower
 */
export const followUser = async (followerID, followedID) => {
  const query = "INSERT INTO follows (followerID, followedID, followedAt) VALUES (?, ?, ?)";

  try {
    const [result] = await connection.query(query, [followerID, followedID, new Date()]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error following a user", err);
    throw new Error("Failed to follow");
  }
};

/**
 * Add a comment
 * @affectedDatabase = comment
 */
export const addComment = async (commentID, content, postID, userID) => {
  const query = "INSERT INTO comments (commentID, content, createdAt, postID, userID) VALUES (?, ?, ?, ?, ?)";

  try {
    const [result] = await connection.query(query, [commentID, content, new Date(), postID, userID]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error adding a comment", err);
    throw new Error("Failed to comment");
  }
};

/**
 * Add a new application
 * @affectedDatabase = application
 */
export const addApplication = async (appID, diplomaURL, schoolIdURL, userID) => {
  const query = "INSERT INTO application (appID, diplomaURL, schoolIdURL, userID, createdAt) VALUES (?, ?, ?, ?, ?);";

  try {
    const [result] = await connection.query(query, [appID, diplomaURL, schoolIdURL, userID, new Date()]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error application", err);
    throw new Error("Failed to add application");
  }
};
