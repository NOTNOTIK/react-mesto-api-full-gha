import edit from "../images/VectorAvatar.png";
import add from "../images/add.svg";
import React from "react";
import Card from "./Card.js";
import { currentUserContext } from '../contexts/CurrentUserContext';
import { useContext } from "react";
export default function Main({onEditAvatar, onEditProfile, onAddPlace, cards, onCardClick,onCardLike, onCardDelete }) {
 
  
  const userContext = useContext(currentUserContext);
 
  return (
    <main className="main">
      <section className="profile">
        <div className="profile__card">
          <button className="avatar" onClick={onEditAvatar}>
            <img src={userContext.avatar} alt={userContext.name} className="profile__avatar" />
          </button>
          <div className="profile__info">
            <div className="profile__name">
              <h1 className="profile__title">{userContext.name}</h1>
              <button
                type="button"
                className="profile__button profile__button_type_edit"
                onClick={onEditProfile}
              >
                <img src={edit} className="image image_type_edit" alt="edit" />
              </button>
            </div>
            <p className="profile__text">{userContext.about}</p>
          </div>
        </div>
        <button
          type="button"
          className="profile__button profile__button_type_add"
          onClick={onAddPlace}
        >
          <img src={add} className="image image_type_add" alt="Добавить" />
        </button>
      </section>
      <section className="cards">
        {cards.map((card) => {
          return (
            <Card card={card} key={card._id} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete}/>
          );
        })}
      </section>
    </main>
  );
}