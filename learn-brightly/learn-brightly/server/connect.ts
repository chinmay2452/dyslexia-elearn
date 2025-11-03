import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

async function main(): Promise<void> {
    const Db: string | undefined = process.env.ATLAS_URI;
    if (!Db) {
        console.error("ATLAS_URI not found in environment variables");
        return;
    }
    
    const client: MongoClient = new MongoClient(Db);

    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db("learn-brightly");
        const collections = await db.listCollections().toArray();
        collections.forEach(collection => console.log(collection.name));
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        await client.close();
    }
}

main();
