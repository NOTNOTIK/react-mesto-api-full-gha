class Api {
  constructor({ url, headers }) {
    this._url = url;
    this._headers = headers;
  }
  _getResponse(response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(new Error("Ошибка"));
  }
  getAllCards() {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/cards`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then(this._getResponse);
  }
  getUserApi() {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/users/me`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then(this._getResponse);
  }
  setUserApi(data) {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/users/me`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(data),
    }).then(this._getResponse);
  }
  setUserAvatar(data) {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/users/me/avatar`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(data),
    }).then(this._getResponse);
  }
  createCard(data) {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/cards`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }).then(this._getResponse);
  }
  deleteCard(cardId) {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/cards/${cardId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    }).then(this._getResponse);
  }

  setLike(cardId) {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: "PUT",
    }).then(this._getResponse);
  }
  deleteLike(cardId) {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    }).then(this._getResponse);
  }
}

const api = new Api({
  url: "https://api.ikorka01.nomoredomainsmonster.ru",
});

export default api;
