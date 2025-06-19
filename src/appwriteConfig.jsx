import { Client, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Replace with your endpoint
  .setProject("682c4837000f7c056fe8"); // Replace with your Project ID

const account = new Account(client);

export { account };
