import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const getAuthToken = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth?.token || null;
};

// Get specific user info
export const getSpecificUserRequest = async (id) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${baseURL}/api/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const userLogin = async (email, password) => {
  try {
    const credentials = { email, password };
    const response = await axios.post(`${baseURL}/api/login`, credentials, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Logout user
export const userLogout = async () => {
  try {
    localStorage.removeItem("auth");
    return true;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Upload a post
export const uploadPost = async (caption, images) => {
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("caption", caption);
    images.forEach((image) => formData.append("images", image.file));

    const response = await axios.post(`${baseURL}/api/post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Upload a line
export const uploadLine = async (caption) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${baseURL}/api/line`,
      { caption },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Fetch posts with pagination
export const fetchPosts = async ({ pageParam = 1, length = 5 }) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${baseURL}/api/posts?page=${pageParam}&length=${length}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred while fetching lists of posts.");
    }

    const data = await response.json();
    const totalPosts = data.totalPosts;
    const totalPages = Math.ceil(totalPosts / length);
    const nextPage = pageParam < totalPages ? pageParam + 1 : undefined;

    return {
      posts: data.posts,
      nextPage,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch user posts
export const fetchUserPosts = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${baseURL}/api/posts/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { posts } = response.data;
    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Fetch post information (likes, comments, etc.)
export const fetchPostInformation = async (postId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${baseURL}/api/post/stats/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Like a post
export const likePost = async (postId) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${baseURL}/api/post/like/${postId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Unlike a post
export const unlikePost = async (postId) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${baseURL}/api/post/unlike/${postId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${baseURL}/api/post/delete/${postId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Fetch followers of a user
export const fetchFollower = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${baseURL}/api/user/follower/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Fetch following of a user
export const fetchFollowing = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${baseURL}/api/user/following/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Follow a user
export const followUserRequest = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${baseURL}/api/user/follow/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Unfollow a user
export const unfollowUserRequest = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${baseURL}/api/user/unfollow/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Check following status
export const checkFollowingStatusRequest = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${baseURL}/api/user/follow_status/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Add comment to post
export const addCommentRequest = async (comment, postId) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${baseURL}/api/post/comment/${postId}`,
      { comment },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Get comments of a post
export const getCommentsRequest = async (postId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${baseURL}/api/post/comments/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Get list of programs
export const getProgramsRequest = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${baseURL}/api/programs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

//Request to apply for a new user account
export const postApplication = async ({
  email,
  roleType,
  userName,
  password,
  firstName,
  lastName,
  middleName,
  program,
  yearGraduated,
  type,
  diplomaImage,
  schoolIdImage,
}) => {
  try {
    const token = getAuthToken();
    const formData = new FormData();

    formData.append("email", email);
    formData.append("roleType", roleType);
    formData.append("userName", userName);
    formData.append("password", password);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("middleName", middleName);
    formData.append("program", program);
    formData.append("yearGraduated", yearGraduated);
    formData.append("type", type);
    formData.append("images", diplomaImage);
    formData.append("images", schoolIdImage);

    const response = await axios.post(`${baseURL}/api/apply`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error submitting application:", error.response?.data || error.message);
    throw new Error(error.response?.data.message || error.message);
  }
};

//Request to update user details
export const updateUserDetailsRequest = async ({ isPrivate, firstName, middleName, lastName, userName, company, jobRole, bio, phoneNumber }) => {
  try {
    const token = getAuthToken();
    const data = { firstName, middleName, lastName, userName, company, jobRole, bio, phoneNumber, isPrivate };
    const response = await axios.patch(`${baseURL}/api/user/update/details`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

//Request to update user profile
export const updateUserProfileRequest = async ({ oldProfileURL, newImage }) => {
  try {
    const token = getAuthToken();
    const formData = new FormData();

    formData.append("oldProfile", oldProfileURL);
    formData.append("image", newImage);

    const response = await axios.patch(`${baseURL}/api/user/update/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

//Request to get conversation messages
export const getConversationMessagesRequest = async (receiverId) => {
  try {
    const token = getAuthToken();

    const response = await axios.get(`${baseURL}/api/conversation/messages`, {
      params: { receiverId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

//Request to get conversation list
export const getConversationListRequest = async () => {
  try {
    const token = getAuthToken();

    const response = await axios.get(`${baseURL}/api/conversation/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

//Request to add new message
export const addNewMessageRequest = async ({ receiverId, conversationID, content }) => {
  try {
    const token = getAuthToken();

    const response = await axios.post(
      `${baseURL}/api/conversation/message`,
      { receiverId, conversationID, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data.message || error.message);
  }
};

// Request to create a new album
export const createNewAlbum = async ({ albumTitle, images }) => {
  try {
    const token = getAuthToken();

    const formData = new FormData();
    formData.append("albumTitle", albumTitle);

    images.forEach((image) => {
      formData.append("images", image.file);
    });

    const response = await axios.post(`${baseURL}/api/album/new`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating new album:", error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Request to add new image on album
export const addImageOnAlbum = async ({ albumTitle, images, albumId }) => {
  try {
    const token = getAuthToken();

    const formData = new FormData();
    formData.append("albumTitle", albumTitle);
    formData.append("albumId", albumId);

    images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await axios.post(`${baseURL}/api/album/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating new album:", error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getAlbumPosts = async (albumId) => {
  try {
    const token = getAuthToken();

    const response = await axios.get(`${baseURL}/api/album/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching album posts:", error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getAlbumInformation = async (albumId) => {
  try {
    const token = getAuthToken();

    const response = await axios.get(`${baseURL}/api/album/information/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching album posts:", error);
    throw new Error(error.response?.data?.message || error.message);
  }
};
