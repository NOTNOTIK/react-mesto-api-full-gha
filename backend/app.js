const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const app = express();
const ERROR_CODE = 400;
const SERVER_ERROR = 500;
const ERROR_NOT_FOUND = 404;
const OK = 200;
const CREATED_OK = 201;
const auth = require("./middlewares/auth");
const NotFoundError = require("./errors/NotFoundError.js"); // 404
const { requestLogger, errorLogger } = require("./middlewares/logger");
module.exports = {
  ERROR_CODE,
  SERVER_ERROR,
  ERROR_NOT_FOUND,
  OK,
  CREATED_OK,
};
const {
  validationCreateUser,
  validationLogin,
} = require("./middlewares/validation.js");
const { login, createUser } = require("./controllers/users");
mongoose.connect("mongodb://127.0.0.1:27017/mestodb");
app.use(cors());
app.use(helmet());
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});
app.post("/signin", validationLogin, login);
app.post("/signup", validationCreateUser, createUser);

app.use(auth);
app.use("/cards", require("./routes/cards"));
app.use("/users", require("./routes/users"));

app.use(errorLogger);

app.use("*", (req, res, next) => {
  return next(new NotFoundError("Страница не найдена"));
});

app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).json({
    message: status === 500 ? "Ошибка сервера" : message,
  });
  next();
});
app.listen(3000, () => {
  console.log(`listening on port ${3000}`);
});
