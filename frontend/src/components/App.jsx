import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header.js";
import Main from "./Main";
import Footer from "./Footer.js";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup.js";
import api from "../utils/api.js";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { currentUserContext } from "../contexts/CurrentUserContext.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Login from "./Login.js";
import Register from "./Register.js";
import { authApi } from "../utils/auth.js";
import InfoTooltip from "./InfoToolTip.js";
import complete from "../images/Complete.svg";
import error from "../images/Error.svg";
function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [userMail, setUserMail] = useState("");

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [infoTooltipImage, setInfoTooltipImage] = useState("");
  const [infoTooltipText, setInfoTooltipText] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  function handleLogin(email, password) {
    authApi
      .authorize(email, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("jwt", res.token);
          setUserMail(email);
          setLoggedIn(true);
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.log(err);
        setIsInfoTooltipOpen(true);
        setInfoTooltipText("Что-то пошло не так! Попробуйте ещё раз.");
        setInfoTooltipImage(error);
      });
  }

  const exit = () => {
    localStorage.removeItem("jwt");
    setUserMail("");
    navigate("/sign-in", { replace: true });
    setLoggedIn(false);
  };

  function handleCheckToken() {
    const jwt = localStorage.getItem("jwt");
    if (localStorage.getItem("jwt")) {
      authApi
        .checkToken(jwt)
        .then((res) => {
          setUserMail(res.data.email);
          setLoggedIn(true);
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  useEffect(() => {
    handleCheckToken();
  }, []);

  function handleRegistration(email, password) {
    authApi
      .register(email, password)
      .then(() => {
        setInfoTooltipText("Вы успешно зарегистрировались!");
        setIsInfoTooltipOpen(true);
        setInfoTooltipImage(complete);
        navigate("/sign-in", { replace: true });
      })
      .catch((err) => {
        console.log(err);
        setIsInfoTooltipOpen(true);
        setInfoTooltipText("Что-то пошло не так! Попробуйте ещё раз.");
        setInfoTooltipImage(error);
      });
  }
  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getAllCards(), api.getUserApi()])
        .then(([cardsInfo, res]) => {
          setCards(cardsInfo);
          setCurrentUser(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((item) => item._id === currentUser._id);
    const checkLike = isLiked
      ? api.deleteLike(card._id)
      : api.setLike(card._id);

    checkLike.then((newCard) => {
      setCards((cards) => cards.map((c) => (c._id === card._id ? newCard : c)));
    });
    checkLike.catch((err) => {
      console.log(err);
    });
  }
  function handleCardDelete(card) {
    console.log("delte");
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((item) => item._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(data) {
    api
      .setUserApi(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(data) {
    api
      .setUserAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlace(data) {
    api
      .createCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <currentUserContext.Provider value={currentUser}>
      <Header mail={userMail} exit={exit} />

      <>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                loggedIn={loggedIn}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                cards={cards}
              />
            }
          />

          <Route
            path="/sign-in"
            element={<Login handleLogin={handleLogin} />}
          />
          <Route
            path="/sign-up"
            element={<Register handleRegister={handleRegistration} />}
          />
          <Route
            path="/*"
            element={<Navigate to={loggedIn ? "/" : "/sign-in"} />}
          />
        </Routes>
      </>

      <Footer />

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlace}
      />
      <InfoTooltip
        isOpen={isInfoTooltipOpen}
        onClose={closeAllPopups}
        logo={infoTooltipImage}
        name={infoTooltipText}
      />

      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
    </currentUserContext.Provider>
  );
}

export default App;
