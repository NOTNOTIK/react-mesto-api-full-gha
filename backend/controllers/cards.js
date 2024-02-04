const {
  OK,

  CREATED_OK,
} = require("../app");
const Card = require("../models/card");
const NotFoundError = require("../errors/NotFoundError.js"); // 404
const BadRequestError = require("../errors/BadRequestError.js"); // 400
const UserError = require("../errors/UserError.js"); // 403
module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(OK).json(cards);
  } catch (err) {
    return next(err);
  }
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).then((card) => {
    if (!card) {
      next(new NotFoundError("Карточка не найдена"));
      return;
    }
    if (card.owner.toString() !== req.user._id) {
      next(new UserError("Невозможно удалить чужую карточку"));
      return;
    }
    card
      .deleteOne()
      .then(() => res.send({ message: "Карточка удалена" }))
      .catch((err) => {
        if (err.name === "CastError") {
          next(new BadRequestError("Переданы некорректные данные"));
        } else {
          next(err);
        }
      });
  });
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(CREATED_OK).json(card);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(
        new BadRequestError("Невалидные данные при создании карточки")
      );
    }
    return next(err);
  }
};

//Я не понимаю, почему оно не проходит автотесты, почему мне вылетает ошибка 400 а не 404. хелп
module.exports.likeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Передан некорректный ID карточки"));
      } else if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Карточка с таким ID не найдена"));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError("Карточка не найдена"));
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};
