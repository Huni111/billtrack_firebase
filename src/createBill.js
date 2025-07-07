import { dB } from "./appwriteConfig";
import { ID } from "appwrite";


const COMPANIES_COLLECTION_ID = "68650f37002e918f8716";
const DATABASE_ID = "685a8b6f000745b9ad99";

export async function createBill(billData) {
  return await dB.createDocument(
    DATABASE_ID,
    COMPANIES_COLLECTION_ID,
    ID.unique(),
    billData
  );
}

  