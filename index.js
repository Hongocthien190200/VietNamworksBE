const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const managerLarksuitToken = require('./managerToken/managerToken');
const larkRoute = require('./routes/larksuite');
const auth = require('./routes/auth');
const morgan = require('morgan')
const app = express();
dotenv.config();
const port = 4000;
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//Route
// app.use("/api/auth", authRoute);
app.use("/api", larkRoute);
app.use("/auth", auth);

app.use(morgan('combined'));

app.listen(port, async () => {
    console.log(`Server is Running on ${port}`);
    await managerLarksuitToken.handleGetAccessToken();
})

