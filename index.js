const app = require("express")();
require("dotenv").config();
const PORT = 3000;

//Connect to mongodb
const mongoose = require("mongoose");

const mongoDB = process.env.MONGO_DB_CONNECTION_STRING;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
app.listen(PORT, () => console.log(`it's live on http://localhost:${PORT}`));
