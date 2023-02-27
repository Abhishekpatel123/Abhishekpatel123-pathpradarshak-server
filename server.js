const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
var multer = require("multer");
var cors = require("cors");
const fileUpload = require("express-fileupload");

// ROUTES
const profile = require("./routes/api/profile");
const users = require("./routes/api/users");
const course = require("./routes/api/course");
const category = require("./routes/api/category");
const enroll = require("./routes/api/enrollRoute");
const role = require("./routes/api/role");
const lecture = require("./routes/api/lecture");

let CATEGORY = require("./models/Category");

const app = express();

// Db Config
const db = require("./config/keys").mongoURI;

//Passport middleware
passport.use(passport.initialize());

//passport config will in
require("./config/passport")(passport);

// MIDDLEWARE
app.use(fileUpload());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

//Connect to mongodb through mongoose
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    CATEGORY.insertMany([
      {
        no: 1,
        categoryName: "HTML",
      },
      {
        no: 2,
        categoryName: "CSS",
      },
      {
        no: 3,
        categoryName: "Javascript",
      },
      {
        no: 4,
        categoryName: "React JS",
      },  
    ]);
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World"));
// catmodel.find().then((result) => console.log(result));

// catmodel.insertMany([
//   {
//     no: 1,
//     categoryName: "Certificate ",
//   },
//   {
//     no: 1,
//     categoryName: "Diploma",
//   },
//   {
//     no: 1,
//     categoryName: "Information Technology",
//   },
//   {
//     no: 4,
//     categoryName: "android",
//   },
//   {
//     no: 1,
//     categoryName: "python",
//   },
// ]).then(res => console.log(res , 'insert'));
//Use routes
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(users);
app.use(course);
app.use(category);
app.use(lecture);
app.use(enroll);
app.use(role);
app.use("/api/profile", profile);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on Port ${port}`));
