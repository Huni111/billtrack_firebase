import { Client, Account, Databases } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") 
  .setProject("682c4837000f7c056fe8"); 

const account = new Account(client);
const dB = new Databases(client);


export { account };
export { client };
export { dB };