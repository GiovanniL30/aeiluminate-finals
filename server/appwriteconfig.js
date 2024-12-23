import { Client, Account, Users, Storage } from "node-appwrite";

/**
 *
 * @author Giovanni Leo
 */
const client = new Client()
  .setEndpoint(process.env.APP_WRITE_ENDPOINT)
  .setProject(process.env.APP_WRITE_PROJECT_ID)
  .setKey(process.env.APP_WRITE_API_KEY);

const account = new Account(client);
const users = new Users(client);
const storage = new Storage(client);

export { client, account, storage, users };
