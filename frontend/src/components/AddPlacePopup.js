import React from "react";
import PopupWithForm from "./PopupWithForm";
import { useEffect } from "react";

export default function AddPlacePopup({ isOpen, onClose, onAddPlace }) {

  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");

  function handleSetName(e) {
    setName(e.target.value);
  }

  function handleSetLink(e) {
    setLink(e.target.value);
  }
  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик

    onAddPlace({
      name, 
      link
    });
  }

  useEffect(() => {
    setName('');
    setLink('');
}, [isOpen]);


  return (
    <PopupWithForm
    name="add"
    isOpen={isOpen}
    title="Новое Место"
    buttonText="Создать"
    onClose={onClose}
    onSubmit={handleSubmit}
    >
        
      <label>
      <input
        type="text"
        placeholder="Название"
        name="title"
        className="popup__input"
        required
        minLength={2}
        maxLength={30}
        autoComplete="off"
        onChange={handleSetName}
        value={name}
      />
      <span className="error" id="title-error" />
    </label>
    <label className="popup__label">
      <input
        type="url"
        placeholder="Ссылка на картинку"
        name="url"
        className="popup__input"
        autoComplete="off"
        required
        onChange={handleSetLink}
        value={link}
      />
      <span className="error" id="url-error" />
    </label>
    </PopupWithForm>
     
  
      
   
 
  );
}
