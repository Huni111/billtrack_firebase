import { Client, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") 
  .setProject("682c4837000f7c056fe8"); 

const account = new Account(client);

export { account };
