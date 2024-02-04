const { OK } = require("../app");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require("../errors/NotFoundError.js"); // 404
const BadRequestError = require("../errors/BadRequestError.js"); // 400
const ConflictError = require("../errors/ConflictError.js"); // 409
const AuthError = require("../errors/AuthError.js"); // 401
module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(OK).json(users);
  } catch (err) {
    return next(err);
  }
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("ID not found"));
      } else if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Пользователь с таким ID не найден"));
      }
      return next(err);
    });
};
module.exports.getOneUser = (req, res, next) => {
  User.findById(req.params._id)
    .orFail()
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("Пользователь с таким ID не найден"));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Неккоректный id"));
      }
      return next(err);
    });
};
module.exports.createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      return res
        .status(OK)
        .json(user.name, user.about, user.avatar, user.email);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError("Пользователь с таким email уже существует")
        );
      }
      return next(err);
    });
};
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body
    .orFail()
    .then((user) => {
      User.findByIdAndUpdate(
        req.user._id,
        { name, about },
        { new: "true", runValidators: true }
      );
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Невалидные данные"));
      } else if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("ID not found"));
      }
      return next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body
    .orFail()
    .then((user) => {
      User.findByIdAndUpdate(
        req.user._id,
        { avatar },
        { new: "true", runValidators: true }
      );
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Невалидные данные"));
      } else if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("ID not found"));
      }
      return next(err);
    });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body || {};
  try {
    const userAdmin = await User.findOne({ email }).select("+password");
    console.log(userAdmin);
    const matched = await bcrypt.compare(password, userAdmin.password);
    if (!matched) {
      return next(new AuthError("NotAuthenticate"));
    }
    const token = jwt.sign(
      { _id: userAdmin._id },
      NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret",
      {
        expiresIn: "7d",
      }
    );
    return res.status(200).send({
      data: { email: userAdmin.email, id: userAdmin._id },
      token,
    });
  } catch (err) {
    return next(err);
  }
};
