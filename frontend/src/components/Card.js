import React from "react";
import { currentUserContext } from '../contexts/CurrentUserContext.js';

export default function Card(props) {
  function handleClick() {
    props.onCardClick(props.card);
  }
  function handleLikeClick() {
    props.onCardLike(props.card);
    
  }
  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }
  const userContext = React.useContext(currentUserContext);
  
  const isOwn = userContext._id === props.card.owner._id;

  const isLiked = props.card.likes.some(i => i._id === userContext._id);
  const cardLikeButtonClassName = ( 
    `cards__like-button ${isLiked ? 'cards__like-button_active' : ''}` 
  );
  
  return (
    <div className="cards__item">
      {isOwn && <button className="cards__del" type="button" name="buttonDelete"  onClick={handleDeleteClick} />} 
      <img
        className="cards__img"
        src={props.card.link}
        alt={props.card.name}
        onClick={handleClick}
      />
      <span className="cards__info">
        <h2 className="cards__title">{props.card.name}</h2>
        <span>
          <button className={cardLikeButtonClassName} onClick={handleLikeClick} type="button"></button>
          <div className="cards__like-number">{props.card.likes.length}</div>
        </span>
      </span>
    </div>
  );
}

