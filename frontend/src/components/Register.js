import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../blocks/register/Register.css"

const Register = ({ handleRegister }) => {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleRegister(formValue.email, formValue.password);
  };

  return (
    <div className="register">
      <p className="register__welcome">Регистрация</p>
      <form onSubmit={handleSubmit} className="register__form">
        <input
          id="email"
          name="email"
          placeholder="Email"
          type="email"
          value={formValue.email}
          onChange={handleChange}/>

        <input
          id="password"
          name="password"
          placeholder="Пароль"
          type="password"
          value={formValue.password}
          onChange={handleChange}/>

        <div className="register__button-container">
          <button
            type="submit"
            onSubmit={handleSubmit}
            className="register__link">
            Зарегистрироваться
          </button>
        </div>
      </form>
      <div className="register__signin">
        <p>Уже зарегистрированы?</p>
        <Link to="/sign-in" className="register__login-link">
          Войти
        </Link>
      </div>
    </div>
  );
};
export default Register;
