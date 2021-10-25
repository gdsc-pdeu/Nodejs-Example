const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
require("./db/Conn");

const path = require("path");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

// Middlewares
app.use("/images", express.static(path.join(__dirname, "public/assets")));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/messages", messageRoute);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/images/posts");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    res.status(200).json("File Uploaded Successfully");
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening to port no. ${PORT}`);
});
