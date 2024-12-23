import connection from "../connections.js";

/**
 * Get user hashed password
 *
 * @author Giovanni Leo
 */
export const getUserWithEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = ?";

  try {
    const [result] = await connection.query(query, [email]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Failed to check email and password:", error);
    throw new Error("Failed to validate email and password");
  }
};

/**
 * Get a specific user from the database
 *
 * @author Giovanni Leo
 */
export const getUser = async (id) => {
  const query = "SELECT * FROM users WHERE userID = ?";

  try {
    const [result] = await connection.query(query, [id]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Failed to get user:", error);
    throw new Error("Failed to retrieve user data");
  }
};

/**
 * Get specific alumni user details including program information
 *
 * @author Giovanni Leo
 */
export const getAlumniDetails = async (id) => {
  const query = `
    SELECT u.userID, u.year_graduated, u.isEmployed, 
           ap.school_name, ap.program_name, ap.specialization
    FROM alumni u
    LEFT JOIN academic_programs ap ON u.programID = ap.programID
    WHERE u.userID = ?`;

  try {
    const [result] = await connection.query(query, [id]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Failed to get alumni details:", error);
    throw new Error("Failed to retrieve alumni data");
  }
};

/**
 * Get an application and user data from the database
 *
 * @author Giovanni Leo
 */
export const getApplication = async (email) => {
  const query = `
    SELECT 
      u.*, 
      a.appID 
    FROM 
      users u
    JOIN 
      application a 
    ON 
      u.userID = a.userID
    WHERE 
      u.email = ?
  `;

  try {
    const [result] = await connection.query(query, [email]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Failed to get application data:", error);
    throw new Error("Failed to retrieve application data");
  }
};

/**
 * Get a list of all programs
 *
 * @author Giovanni Leo
 */
export const getPrograms = async () => {
  const query = "SELECT * FROM academic_programs";

  try {
    const [result] = await connection.query(query);
    return result;
  } catch (error) {
    console.error("Failed to get programs:", error);
    throw new Error("Failed to retrieve programs");
  }
};

/**
 * Get comment, like count, and user's like status for a specific post
 *
 * @author Giovanni Leo
 */
export const getPostStats = async (postId, userId) => {
  const query = `
    SELECT 
        p.postID, 
        u.username AS posted_by,
        u.profile_picture AS profile_link,
        COUNT(DISTINCT l.userID) AS total_likes, 
        COUNT(DISTINCT c.commentID) AS total_replies,
        MAX(CASE WHEN l.userID = ? THEN 1 ELSE 0 END) AS is_liked
    FROM 
        posts p
    LEFT JOIN 
        likes l ON p.postID = l.postID
    LEFT JOIN 
        comments c ON p.postID = c.postID
    LEFT JOIN 
        users u ON p.userID = u.userID
    WHERE 
        p.postID = ?
    GROUP BY 
        p.postID, u.username
  `;

  try {
    const [result] = await connection.query(query, [userId, postId]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Failed to get post stats:", error);
    throw new Error("Failed to get post stats");
  }
};

/**
 * Check if the username is already in the database
 *
 * @author Giovanni Leo
 */
export const checkUsername = async (username, userId = null) => {
  let query = "SELECT COUNT(*) as users FROM users WHERE username = ?";
  const params = [username];

  if (userId) {
    query += " AND userID != ?";
    params.push(userId);
  }

  try {
    const [results] = await connection.query(query, params);

    return results[0].users > 0;
  } catch (error) {
    console.error("Failed to check username:", error);
    throw new Error("Failed to check username");
  }
};

/**
 * Check if the email is already in the database
 *
 * @author Giovanni Leo
 */
export const checkEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = ?";

  try {
    const [results] = await connection.query(query, [email]);
    return results.length > 0;
  } catch (error) {
    console.error("Failed to check email:", error);
    throw new Error("Failed to check email");
  }
};

/**
 * Fetch paginated users excluding those who have an ID in the application table
 * and filter by search query (key)
 *
 * @author Giovanni Leo
 */
export const getUsers = async (page, pageSize, key) => {
  const offset = (page - 1) * pageSize;

  try {
    const [results] = await connection.query(
      `
      SELECT u.*
      FROM users u
      LEFT JOIN application a ON u.userID = a.userID
      WHERE a.userID IS NULL
      ${
        key
          ? `
        AND (
          u.username LIKE ? OR
          u.firstName LIKE ? OR
          u.middleName LIKE ? OR
          u.lastName LIKE ? OR
          u.email LIKE ?
        )
      `
          : ""
      }
      LIMIT ? OFFSET ?
      `,
      key
        ? [`%${key}%`, `%${key}%`, `%${key}%`, `%${key}%`, `%${key}%`, parseInt(pageSize), parseInt(offset)]
        : [parseInt(pageSize), parseInt(offset)]
    );

    const [[countResult]] = await connection.query(
      `
      SELECT COUNT(*) AS total
      FROM users u
      LEFT JOIN application a ON u.userID = a.userID
      WHERE a.userID IS NULL
      ${
        key
          ? `
        AND (
          u.username LIKE ? OR
          u.firstName LIKE ? OR
          u.middleName LIKE ? OR
          u.lastName LIKE ? OR
          u.email LIKE ?
        )
      `
          : ""
      }
      `,
      key ? [`%${key}%`, `%${key}%`, `%${key}%`, `%${key}%`, `%${key}%`] : []
    );

    return { users: results, total: countResult.total };
  } catch (error) {
    console.error("Error fetching paginated users:", error);
    throw new Error("Error fetching paginated users");
  }
};

/**
 *
 * @author Giovanni Leo
 */
export const getPosts = async (page, pageSize, userId) => {
  const query = `
    SELECT posts.*, 
           users.isPrivate 
    FROM posts
    LEFT JOIN users ON posts.userID = users.userID  
    WHERE (posts.albumId IS NULL AND users.isPrivate = 0)
    ORDER BY posts.createdAt DESC 
    LIMIT ? OFFSET ?
  `;

  const offset = (page - 1) * pageSize;

  try {
    const [results] = await connection.query(query, [parseInt(pageSize), parseInt(offset)]);
    const [[countResult]] = await connection.query(
      "SELECT COUNT(*) AS total FROM posts LEFT JOIN users ON posts.userID = users.userID WHERE posts.albumId IS NULL AND (users.isPrivate = 0)"
    );
    return { posts: results, total: countResult.total };
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    throw new Error("Error fetching paginated posts");
  }
};

/**
 * Fetch posts of a user
 *
 * @author Giovanni Leo
 */
export const getUserPosts = async (userId) => {
  const query = "SELECT * FROM posts WHERE userID = ?";

  try {
    const [results] = await connection.query(query, [userId]);
    return results.length > 0 ? results : [];
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw new Error("Error fetching user posts");
  }
};

/**
 * Get all list of media files of a post
 *
 * @author Giovanni Leo
 */
export const getMedia = async (postId) => {
  const query = "SELECT mediaID, mediaURL, mediaType FROM media WHERE postID = ?";

  try {
    const [results] = await connection.query(query, [postId]);
    return results;
  } catch (error) {
    console.error("Failed to get media of the post:", error);
    throw new Error("Failed to get media");
  }
};

/**
 * Get the followers of a user
 *
 * @author Giovanni Leo
 */
export const getUserFollowers = async (userId) => {
  const query = `
    SELECT 
      u.userID, 
      u.username, 
      u.profile_picture, 
      u.role, 
      (SELECT COUNT(*) FROM follows WHERE followedID = u.userID) AS total_followers
    FROM follows f
    JOIN users u ON f.followerID = u.userID
    WHERE f.followedID = ?
  `;

  try {
    const [results] = await connection.query(query, [userId]);
    return results || [];
  } catch (error) {
    console.error("Failed to get followers:", error);
    throw new Error("Failed to fetch followers");
  }
};

/**
 * Get the users that a user is following
 *
 * @author Giovanni Leo
 */
export const getUserFollowing = async (userId) => {
  const query = `
    SELECT 
      u.userID, 
      u.username, 
      u.profile_picture, 
      u.role, 
      (SELECT COUNT(*) FROM follows WHERE followedID = u.userID) AS total_followers
    FROM follows f
    JOIN users u ON f.followedID = u.userID
    WHERE f.followerID = ?
  `;

  try {
    const [results] = await connection.query(query, [userId]);
    return results || [];
  } catch (error) {
    console.error("Failed to get following:", error);
    throw new Error("Failed to fetch following users");
  }
};

/**
 * Check if the user is following a user
 *
 * @author Giovanni Leo
 */
export const checkIsFollowing = async (followerID, followingID) => {
  const query = "SELECT COUNT(*) AS is_following FROM follows WHERE followerID = ? AND followedID = ?";

  try {
    const [results] = await connection.query(query, [followerID, followingID]);
    return results.length > 0 && results[0].is_following > 0;
  } catch (error) {
    console.error("Failed to check following status:", error);
    throw new Error("Failed to check following status");
  }
};

/**
 * Get comments for a specific post
 *
 * @author Giovanni Leo
 */
export const getPostComments = async (postId) => {
  const query = `
      SELECT 
        c.commentID,
        c.content AS commentContent,
        c.createdAt AS commentCreatedAt,
        u.userID,
        u.username AS userName,
        u.profile_picture AS userProfilePic
      FROM 
          comments c
      JOIN 
          users u ON c.userID = u.userID
      WHERE 
          c.postID = ?
  `;

  try {
    const [comments] = await connection.query(query, [postId]);
    return comments || [];
  } catch (error) {
    console.error("Failed to get post comments:", error);
    throw new Error("Failed to retrieve comments");
  }
};

/**
 * Check if a conversation already exists between two users
 *
 * @author Giovanni Leo
 */
export const checkIfConversationAvailable = async (senderID, receiverID) => {
  const query = `
    SELECT * 
    FROM conversation 
    WHERE (memberOne = ? AND memberTwo = ?)
       OR (memberOne = ? AND memberTwo = ?)
    LIMIT 1;
  `;

  try {
    const [result] = await connection.query(query, [senderID, receiverID, receiverID, senderID]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error checking if conversation exists:", error);
    throw new Error("Failed to check if conversation exists");
  }
};

/**
 * Get conversation messages for a specific conversation
 *
 * @author Giovanni Leo
 */
export const getConversationMessages = async (conversationID) => {
  const query = `
    SELECT 
      pm.messageID,
      pm.senderID,
      pm.receiverID,
      pm.content,
      pm.createdAt AS messageTimestamp,
      sender.firstName AS senderFirstName,
      sender.lastName AS senderLastName,
      sender.username AS senderUsername,
      sender.profile_picture AS senderProfilePicture,
      receiver.firstName AS receiverFirstName,
      receiver.lastName AS receiverLastName,
      receiver.username AS receiverUsername,
      receiver.profile_picture AS receiverProfilePicture
    FROM 
      private_messages pm
    LEFT JOIN 
      users sender ON pm.senderID = sender.userID
    LEFT JOIN 
      users receiver ON pm.receiverID = receiver.userID
    WHERE 
      pm.conversationID = ?
    ORDER BY 
      pm.createdAt ASC;
  `;

  try {
    const [messages] = await connection.query(query, [conversationID]);
    return messages || [];
  } catch (error) {
    console.error("Failed to retrieve conversation messages:", error);
    throw new Error("Failed to retrieve conversation messages");
  }
};

/**
 * Get all conversations for a certain user
 *
 * @author Giovanni Leo
 */
export const getAllUserConversations = async (userID) => {
  const query = `
    SELECT 
      c.conversationID,
      memberOne.userID AS memberOneID,
      memberOne.firstName AS memberOneFirstName,
      memberOne.lastName AS memberOneLastName,
      memberOne.username AS memberOneUsername,
      memberOne.profile_picture AS memberOneProfilePicture,
      memberTwo.userID AS memberTwoID,
      memberTwo.firstName AS memberTwoFirstName,
      memberTwo.lastName AS memberTwoLastName,
      memberTwo.username AS memberTwoUsername,
      memberTwo.profile_picture AS memberTwoProfilePicture,
      c.createdAt AS conversationCreatedAt
    FROM 
      conversation c
    LEFT JOIN 
      users memberOne ON c.memberOne = memberOne.userID
    LEFT JOIN 
      users memberTwo ON c.memberTwo = memberTwo.userID
    WHERE 
      c.memberOne = ? OR c.memberTwo = ?
    ORDER BY 
      c.createdAt DESC;
  `;

  try {
    const [conversations] = await connection.query(query, [userID, userID]);
    return conversations || [];
  } catch (error) {
    console.error("Failed to retrieve conversations:", error);
    throw new Error("Failed to retrieve conversations");
  }
};

/**
 * Get all posts and their media for a specific album
 *
 * @author Giovanni Leo
 */
export const getPostsByAlbumId = async (albumId) => {
  const query = `
    SELECT 
      p.postID,
      p.userID,
      p.caption,
      p.createdAt,
      m.mediaID,
      m.mediaType,
      m.mediaURL
    FROM 
      posts p
    LEFT JOIN 
      media m ON p.postID = m.postID
    LEFT JOIN 
      albums a ON p.albumId = a.albumId  -- Corrected join condition
    WHERE 
      a.albumId = ?  
    ORDER BY 
      p.createdAt DESC;
  `;

  try {
    const [posts] = await connection.query(query, [albumId]);
    return posts || [];
  } catch (error) {
    console.error("Error fetching posts for album:", error);
    throw new Error("Error fetching posts for album");
  }
};

/**
 * Get album information along with user details (user ID, profile picture, username)
 *
 * @author Giovanni Leo
 */
export const getAlbumInformation = async (albumId) => {
  const query = `
    SELECT 
      a.albumId,
      a.albumTitle,
      u.userID AS userId,
      u.username,
      u.firstName,
      u.lastName,
      u.profile_picture AS profilePic
    FROM 
      albums a
    LEFT JOIN 
      users u ON a.albumIdOwner = u.userID
    WHERE 
      a.albumId = ?;
  `;

  try {
    const [result] = await connection.query(query, [albumId]);

    if (result.length === 0) {
      throw new Error("Album not found");
    }

    return result[0];
  } catch (error) {
    console.error("Error fetching album information:", error);
    throw new Error("Failed to retrieve album information");
  }
};

/**
 * Get list of albums
 *
 * @author Giovanni Leo
 */
export const getAlbums = async (offset, limit) => {
  const query = `
    SELECT 
    albums.albumId, 
    albums.albumTitle, 
    albums.albumIdOwner, 
    latest_posts.latestPostID, 
    latest_posts.latestPostCaption, 
    latest_posts.latestPostCreatedAt
  FROM albums
  LEFT JOIN (
    SELECT 
      posts.albumId, 
      posts.postID AS latestPostID, 
      posts.caption AS latestPostCaption, 
      posts.createdAt AS latestPostCreatedAt
    FROM posts
    WHERE (albumId, createdAt) IN (
      SELECT albumId, MAX(createdAt)
      FROM posts
      GROUP BY albumId
    )
  ) AS latest_posts ON albums.albumId = latest_posts.albumId
  ORDER BY albums.albumTitle
  LIMIT ? OFFSET ?
  `;

  try {
    const [results] = await connection.query(query, [limit, offset]);
    const [[countResult]] = await connection.query("SELECT COUNT(*) AS total FROM albums");
    return { albums: results, total: countResult.total };
  } catch (error) {
    console.error("Error fetching paginated albums with latest posts:", error);
    throw new Error("Error fetching paginated albums with latest posts");
  }
};

/**
 * Get list of events
 *
 * @author Giovanni Leo, Eugene Kyle Patano
 */
export const getEvents = async (page, pageSize) => {
  const query = `
    SELECT *
    FROM events
    ORDER BY createdOn DESC 
    LIMIT ? OFFSET ?
  `;

  const offset = (page - 1) * pageSize;

  try {
    const [results] = await connection.query(query, [parseInt(pageSize), parseInt(offset)]);
    const [[countResult]] = await connection.query("SELECT COUNT(*) AS total FROM events");
    return { events: results, total: countResult.total };
  } catch (error) {
    console.error("Error fetching paginated events:", error);
    throw new Error("Error fetching paginated events");
  }
};

/**
 * Get events posted by a user
 *
 * @author Eugene Kyle Patano
 */
export const getUserEvents = async (userId) => {
  const query = "SELECT * FROM events WHERE createdBy = ?";

  try {
    const [results] = await connection.query(query, [userId]);
    return results.length > 0 ? results : [];
  } catch (error) {
    console.error("Error fetching user events:", error);
    throw new Error("Error fetching user events");
  }
};

/**
 * Get interested users of an event
 *
 * @author Eugene Kyle Patano
 */
export const getUserInterestedEvents = async (userId) => {
  const query = `
  SELECT * FROM events 
  LEFT JOIN interested_users iu USING (eventID) 
  WHERE iu.userID = ?`;

  try {
    const [results] = await connection.query(query, [userId]);
    return results.length > 0 ? results : [];
  } catch (error) {
    console.error("Error fetching user interested events:", error);
    throw new Error("Error fetching user interested events");
  }
};

/**
 * Get interested users count for a specific event
 *
 * @author Giovanni Leo, Eugene Kyle Patano
 */
export const getEventStats = async (eventId, userId) => {
  const query = `
    SELECT 
    u.* 
    FROM 
        users u
    INNER JOIN 
        interested_users iu ON u.userid = iu.userid
    WHERE 
        iu.eventid = ?;
  `;

  try {
    const [result] = await connection.query(query, [eventId]);
    return result;
  } catch (error) {
    console.error("Failed to get event stats:", error);
    throw new Error("Failed to get event stats");
  }
};

/**
 * Check if the user is interested on the event
 *
 * @author Giovanni Leo, Eugene Kyle Patano
 */

export const checkInterested = async (eventId, userId) => {
  const query = "SELECT * FROM interested_users WHERE eventid = ? AND userid = ?";

  try {
    const [result] = await connection.query(query, [eventId, userId]);

    return result.length > 0;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get");
  }
};

/**
 * Fetch job listings post
 *
 * @author Giovanni Leo, Jhea Jana Prudencio
 */

export const getJobListings = async (page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const query = `
    SELECT *
    FROM job_listing
    LIMIT ? OFFSET ?
  `;

  try {
    const [results] = await connection.query(query, [parseInt(pageSize), parseInt(offset)]);
    const [[countResult]] = await connection.query("SELECT COUNT(*) AS total FROM job_listing");
    return { listings: results, total: countResult.total };
  } catch (error) {
    console.error("Failed to fetch job listing: ", error);
    throw new Error("Failed to retrieve job listings");
  }
};

/**
 * Check if the user is the owner of the post
 *
 * @author Giovanni Leo
 */

export const checkIfUserPost = async (userId, postId) => {
  const query = `
    SELECT 
      CASE 
        WHEN userID = ? THEN TRUE 
        ELSE FALSE 
      END AS isOwner
    FROM posts
    WHERE postID = ?;
  `;

  try {
    const [results] = await connection.query(query, [userId, postId]);

    if (results.length === 0) {
      throw new Error("Post not found or invalid postID");
    }
    const isOwner = results[0].isOwner;
    return { isOwner };
  } catch (error) {
    console.error("Failed to check if user owns the post: ", error);
    throw new Error("Failed to check post ownership");
  }
};

/**
 * Check if the user is the owner of the event
 *
 * @author Giovanni Leo
 */

export const checkIfUserEvent = async (userId, eventId) => {
  const query = `
    SELECT 
      createdBy = ? AS isOwner
    FROM events
    WHERE eventID = ?;
  `;

  try {
    const [results] = await connection.query(query, [userId, eventId]);

    if (results.length === 0) {
      throw new Error("Event not found or invalid event ID");
    }

    const isOwner = results[0].isOwner === 1;
    return { isOwner };
  } catch (error) {
    console.error("Failed to check if user owns the event: ", error);
    throw new Error("Failed to check event ownership");
  }
};

/**
 * Check if the user is the owner of the event
 *
 * @author Giovanni Leo
 */
export const checkIfUserJobPost = async (userId, jobId) => {
  const query = `
    SELECT 
      createdBy = ? AS isOwner
    FROM job_listing
    WHERE jobID = ?;
  `;

  try {
    const [results] = await connection.query(query, [userId, jobId]);

    if (results.length === 0) {
      throw new Error("Job not found or invalid job ID");
    }

    const isOwner = results[0].isOwner === 1;
    return { isOwner };
  } catch (error) {
    console.error("Failed to check if user owns the job post: ", error);
    throw new Error("Failed to check job ownership");
  }
};
