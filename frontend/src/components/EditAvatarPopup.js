import React from "react";
import PopupWithForm from "./PopupWithForm";


export default function EditAvatarPopup(props){
    const inputRef = React.useRef(null)

    function handleSubmit(e) {
        e.preventDefault();
      
        props.onUpdateAvatar({
          avatar: inputRef.current.value,
        });
      }

      return (
        <PopupWithForm
        name="ava"
        isOpen={props.isOpen}
        title="Сменить аватар"
        buttonText="Сменить"
        onClose={props.onClose}
        onSubmit={handleSubmit}
        >
           <label>
              <input
                type="url"
                placeholder="Ссылка на картинку"
                name="avatar"
                className="popup__input"
                autoComplete="off"
                required
                ref={inputRef}
              />
              <span className="error" id="avatar-error" />
            </label>
        </PopupWithForm>
      
      )
}
