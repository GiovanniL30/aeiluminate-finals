import { account } from "../appwriteconfig.js";
import { ID } from "node-appwrite";
import { addNewAlumni, addNewUser, checkEmail, checkUsername, removeUserAccount } from "../mysqlQueries/queries.js";

/**
 *  Creates a new account on the Database (user, alumni) and on Appwrite
 *  @method POST
 *  @route /api/register/client
 */
export const createUserAccountController = async (req, res) => {
  const { email, userName, password, employment, firstName, lastName, middleName, program, roleType, yearGraduated } = req.body;

  if (!email || !userName || !password || !employment || !firstName || !lastName || !middleName || !program || !roleType || !yearGraduated) {
    return res.status(400).json({ message: "Bad request body (missing fields)" });
  }

  try {
    const usernameExists = await checkUsername(userName);
    if (usernameExists) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const emailExists = await checkEmail(email);
    if (emailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const id = appWriteUser.$id;

    const newUser = await addNewUser(id, roleType, email, userName, password, firstName, middleName, lastName);

    if (!newUser) return res.status(409).json({ message: "Failed to create a new user in the database" });

    if (roleType === "Alumni") {
      const alumni = await addNewAlumni(id, yearGraduated, program, employment);

      if (!alumni) {
        await removeUserAccount(id);
        return res.status(500).json({ message: "Internal Server error: Failed to add alumni details" });
      }
    }

    res.status(201).json({ message: "User created successfully", userId: appWriteUser.$id });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error (Failed to create account)" });
  }
};