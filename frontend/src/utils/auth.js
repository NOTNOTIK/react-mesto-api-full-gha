class Auth {
  constructor({ url }) {
    this._url = url;
  }

  _checkRes(res) {
    if (res.ok) {
      return res.json();
    }
    throw new Error("ошибка!");
  }

  register(email, password) {
    return fetch(`${this._url}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then(this._checkRes);
  }

  authorize(email, password) {
    return fetch(`${this._url}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then(this._checkRes);
  }

  checkToken() {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(this._checkRes);
  }
}

export const authApi = new Auth({
  url: "http://localhost:3000",
});
//https://auth.nomoreparties.co
