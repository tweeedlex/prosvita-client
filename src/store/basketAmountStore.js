import { makeAutoObservable } from "mobx"

class basketAmountStore {
    constructor() {
        makeAutoObservable(this)
        this._basketAmount = []
    }

    setBasketAmount(basketAmount) {
        this._basketAmount = basketAmount
    }

    getBasketAmount() {
        return this._basketAmount
    }
}

export default new basketAmountStore()