const userRouter = require("express").Router();
const {
  getUsers,
  getUserById,
  getOneUser,
  updateUser,
  updateUserAvatar,
} = require("../controllers/users");
const { Joi, celebrate } = require("celebrate");
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.get("/me", getOneUser);
userRouter.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);
userRouter.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
        ),
    }),
  }),
  updateUserAvatar
);
module.exports = userRouter;
