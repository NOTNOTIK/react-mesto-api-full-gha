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
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password }),
    }).then(this._checkRes);
  }

  authorize(email, password, jwt) {
    return fetch(`${this._url}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ email, password }),
    }).then(this._checkRes);
  }

  checkToken(jwt) {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }).then(this._checkRes);
  }
}

export const authApi = new Auth({
  url: "http://localhost:3000",
});
//https://auth.nomoreparties.co
