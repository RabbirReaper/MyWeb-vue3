import { MongoClient } from 'mongodb';

const localUri = "mongodb://127.0.0.1:27017";
const cloudUri = "mongodb+srv://Rabbir:b6dHIplh2Uscrp8g@rabbiraccounting.kpirr.mongodb.net/mycloudDB";

const localClient = new MongoClient(localUri);
const cloudClient = new MongoClient(cloudUri);

async function transferData() {
  try {
    // 連接到本地和雲端數據庫
    await localClient.connect();
    await cloudClient.connect();

    // 本地和雲端數據庫實例
    const localDb = localClient.db("accounting");
    const cloudDb = cloudClient.db("accounting");

    // 獲取本地數據庫中的所有集合名稱
    const collections = await localDb.listCollections().toArray();

    // 遍歷所有集合並上傳數據
    for (const collection of collections) {
      const collectionName = collection.name;

      console.log(`Transferring collection: ${collectionName}`);

      // 獲取本地集合的數據
      const data = await localDb.collection(collectionName).find().toArray();

      // 如果集合中有數據，插入到雲端集合中
      if (data.length > 0) {
        await cloudDb.collection(collectionName).insertMany(data);
        console.log(`Transferred ${data.length} documents from collection: ${collectionName}`);
      } else {
        console.log(`Collection ${collectionName} is empty, skipping.`);
      }
    }

    console.log("All data transferred successfully!");
  } catch (error) {
    console.error("Error during data transfer:", error);
  } finally {
    // 關閉客戶端連接
    await localClient.close();
    await cloudClient.close();
  }
}

transferData().catch(console.error);
