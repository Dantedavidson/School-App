const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//Connect to mongodb
const mongoose = require("mongoose");
const mongoDB = process.env.MONGO_DB_CONNECTION_STRING;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//Routing
// const apiRouter = require("./routes/api");
// app.use("/api", apiRouter);
const teacherRouter = require("./routes/teacher");
const studentRouter = require("./routes/student");
const lessonRouter = require("./routes/lesson");
const yeargroupRouter = require("./routes/yeargroup");
const departmentRouter = require("./routes/department");

app.use("/api/teachers", teacherRouter);
app.use("/api/students", studentRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/yeargroups", yeargroupRouter);
app.use("/api/departments", departmentRouter);

app.listen(PORT, () => console.log(`it's live on http://localhost:${PORT}`));
