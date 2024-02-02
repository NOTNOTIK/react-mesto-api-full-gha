import React from 'react';
import '../blocks/login/Login.css';
import { useState } from 'react';
const Login = ({handleLogin}) => {
  const [formValue, setFormValue] = useState({
    email: '',
    password: ''
  })

  const handleChange = (evt) => {
    const { name, value } = evt.target;

    setFormValue({
      ...formValue,
      [name]: value
    })
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();

    handleLogin(formValue.email, formValue.password)
  }
  
    return(
      <div className="login">
        <p className="login__welcome">
          Вход
        </p>
        <form onSubmit={handleSubmit} className="login__form">
         
          <input required id="email" placeholder='Email' name="email" type="text" value={formValue.email} onChange={handleChange} />
         
          <input required id="password" name="password" placeholder='Пароль' type="password" value={formValue.password} onChange={handleChange} />
          <div className="login__button-container">
            <button type="submit" className="login__link">Войти</button>
          </div>
        </form>
      
      </div>
    )
  
}

export default Login;