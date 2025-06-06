const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

async function main() {
    const Db = process.env.ATLAS_URI;
    const client = new MongoClient(Db);

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