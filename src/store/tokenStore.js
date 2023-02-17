import { makeAutoObservable } from "mobx"

class tokenStore {
    constructor() {
        makeAutoObservable(this)
        this._token = []
    }

    setToken(token) {
        this._token = token
    }

    getToken() {
        return this._token
    }
}

export default new tokenStore()