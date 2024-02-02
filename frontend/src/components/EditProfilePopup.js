import React from "react";

import PopupWithForm from "./PopupWithForm";

import { currentUserContext } from "../contexts/CurrentUserContext";

export default function EditProfilePopup(props) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const currentUser = React.useContext(currentUserContext);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleSetName(e) {
    setName(e.target.value);
  }

  function handleSetDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик

    props.onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name="edit"
      isOpen={props.isOpen}
      title="Редактировать профиль"
      buttonText="Сохранить"
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <label className="popup__label">
        <input
          type="text"
          placeholder="Введите имя"
          name="name"
          className="popup__input popup__input_type_name"
          minLength={2}
          maxLength={40}
          value={name || ""}
          required
          onChange={handleSetName}
        />

        <span className="error" id="name-error" />
      </label>

      <label className="popup__label">
        <input
          type="text"
          placeholder="Введите род деятельности"
          name="about"
          className="popup__input popup__input_type_job"
          minLength={2}
          maxLength={200}
          onChange={handleSetDescription}
          value={description || ""}
          required
        />

        <span className="error" id="about-error" />
      </label>
    </PopupWithForm>
  );
}
