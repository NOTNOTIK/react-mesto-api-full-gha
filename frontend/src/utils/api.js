class Api {
  constructor({ url, headers }) {
    this._url = url;

    this._headers = headers;
  }

  _getResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(new Error("Ошибка"));
  }
  _getHeaders() {
    const token = localStorage.getItem("jwt");
    if (token) {
      return {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    } else {
      return {
        "Content-Type": "application/json",
      };
    }
  }

  getAllCards() {
    return fetch(`${this._url}/cards`, {
      headers: this._getHeaders(),
    }).then(this._getResponse);
  }

  getUserApi() {
    return fetch(`${this._url}/users/me`, {
      headers: this._getHeaders(),
    }).then(this._getResponse);
  }

  setUserApi(data) {
    return fetch(`${this._url}/users/me`, {
      headers: this._getHeaders(),

      method: "PATCH",

      body: JSON.stringify(data),
    }).then(this._getResponse);
  }

  setUserAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      headers: this._getHeaders(),
      method: "PATCH",

      body: JSON.stringify(data),
    }).then(this._getResponse);
  }

  createCard(data) {
    return fetch(`${this._url}/cards`, {
      headers: this._getHeaders(),
      method: "POST",

      body: JSON.stringify(data),
    }).then(this._getResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}`, {
      headers: this._getHeaders(),
      method: "DELETE",
    }).then(this._getResponse);
  }

  setLike(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      headers: this._getHeaders(),
      method: "PUT",
    }).then(this._getResponse);
  }

  deleteLike(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      headers: this._getHeaders(),
      method: "DELETE",
    }).then(this._getResponse);
  }
}

const api = new Api({
  url: "https://ikorka01.nomoredomainsmonster.ru",
});

export default api;
