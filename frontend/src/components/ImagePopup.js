import React from "react";
export default function ImagePopup(props) {
  return (
    <div
      className={`popup popup_type_image ${props.card ? "popup_opened" : ""}`}
    >
      <div className="popup__img-container">
        <img
          className="popup__image"
          src={props.card?.link}
          alt={props.card?.name} 
        />
        <p className="popup__figcaption">{props.card?.name}</p>
        <button
          type="button"
          className="popup__close"
          id="closeImg"
          onClick={props.onClose}
        />
      </div>
    </div>
  );
}
