import { checkIsFollowing, getUser, getUserFollowers, getUserFollowing, getUsers } from "../mysqlQueries/readQueries.js";
import { removeUserAccount, unfollowUser } from "../mysqlQueries/deleteQueries.js";
import { followUser } from "../mysqlQueries/addQueries.js";

/**
 *  Get all users on the Database (user)
 *  @method GET
 *  @route /api/users
 */
export const getUsersContoller = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  try {
    const { users, total } = await getUsers(page, pageSize);

    const totalPages = Math.ceil(total / pageSize);

    res.json({
      results: users,
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
        totalRecords: total,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users (Internal Server error)" });
  }
};

/**
 * Get a specific user from the Database (user)
 * @method GET
 * @route /api/user/:id
 */
export const getUserController = async (req, res) => {
  const { userId } = req;

  try {
    const user = await getUser(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userData } = user;

    res.json({ user: userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch user (Internal Server Error)" });
  }
};

/**
 *  Delete user on the database
 *  @method DELETE
 *  @route /api/users/delete/:id
 */
export const deleteUserController = async (req, res) => {
  const { id } = req.params;

  try {
    const removed = await removeUserAccount(id);
    if (!removed) {
      return res.status(500).json({ message: "Failed to delete user from database" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server error (Failed to delete user)" });
  }
};

/**
 *  Get follower count of a user
 *  @method GET
 *  @route /api/user/follower_count/:id
 */
export const userFollowerController = async (req, res) => {
  const { id } = req.params;

  try {
    const followerCount = await getUserFollowers(id);

    res.status(200).json(followerCount);
  } catch (error) {
    console.error("Error fetching follower count:", error);
    res.status(500).json({ message: "Internal Server Error (Failed to fetch follower count)" });
  }
};

/**
 *  Get following count of a user
 *  @method GET
 *  @route /api/user/following_count/:id
 */
export const userFollowingController = async (req, res) => {
  const { id } = req.params;

  try {
    const followingCount = await getUserFollowing(id);

    res.status(200).json(followingCount);
  } catch (error) {
    console.error("Error fetching following count:", error);
    res.status(500).json({ message: "Internal Server Error (Failed to fetch following count)" });
  }
};

/**
 *  Follow a user
 *  @method POST
 *  @route /api/user/follow/:id
 */
export const followUserController = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  try {
    const result = await followUser(userId, id);

    if (!result) throw new Error("Failed to follow");

    res.status(200).json({ message: "Followed" });
  } catch (error) {
    console.error("Error following a user:", error);
    res.status(500).json({ message: "Internal Server Error (Failed to follow)" });
  }
};

/**
 *  Unfollow a user
 *  @method POST
 *  @route /api/user/unfollow/:id
 */
export const unFollowUserController = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  try {
    const result = await unfollowUser(userId, id);

    if (!result) throw new Error("Failed to unfollow");

    res.status(200).json({ message: "Unfollowed" });
  } catch (error) {
    console.error("Error following a user:", error);
    res.status(500).json({ message: "Internal Server Error (Failed to unfollow)" });
  }
};

/**
 *  Unfollow a user
 *  @method POST
 *  @route /api/user/follow_status/:id
 */
export const checkIsFollowingController = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  try {
    const result = await checkIsFollowing(userId, id);

    res.status(200).json({ isFollowing: result });
  } catch (error) {
    console.error("Error following checking status:", error);
    res.status(500).json({ message: "Internal Server Error (Failed to check follow status)" });
  }
};
