class Auth {
  constructor(options) {
    this._url = options.url;
    this._headers = options.headers;
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
      headers: this._headers,
      body: JSON.stringify({ email, password }),
    }).then(this._checkRes);
  }

  authorize(email, password) {
    return fetch(`${this._url}/signin`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ email, password }),
    }).then(this._checkRes);
  }

  checkToken(token) {
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
  url: "https://api.ikorka01.nomoredomainsmonster.ru",
  headers: {
    "Content-Type": "application/json",
  },
});
