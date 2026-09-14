const mongoose = require("mongoose");
const dns = require("dns");

// Fallback DNS servers for SRV resolution (fixes querySrv ECONNREFUSED on Windows/campus networks)
try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
    console.warn("Could not set custom DNS servers:", e.message);
}

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is undefined. Check server/.env file.");
        }
        console.log("Connecting to MongoDB Atlas Remote Cluster...");
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000,
        });
        console.log("MongoDB connected successfully (Atlas / Remote Cluster)");
    } catch (error) {
        console.warn(
            `Primary MongoDB Atlas connection unavailable (${error.message}).`
        );
        console.log("Starting in-memory MongoDB fallback instance...");

        try {
            const { MongoMemoryServer } = require("mongodb-memory-server");
            const mongod = await MongoMemoryServer.create({
                instance: {
                    dbName: "isoi_hackathon",
                    timeout: 60000,
                },
            });
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log(`MongoDB connected successfully (In-Memory Database at ${uri})`);
        } catch (memErr) {
            console.error("Critical MongoDB connection error:", memErr.message);
            process.exit(1);
        }
    }
};

module.exports = connectDB;