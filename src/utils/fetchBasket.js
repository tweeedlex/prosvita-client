import axios from "axios"
import { SERVER_URL } from "../config"

const fetchBasket = async (setIsAuth) => {
    try {
        let response = await axios.get(SERVER_URL + "/api/basket", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("user-token")
            }
        })

        if (response.data?.message) {
            return setIsAuth(false)
        }

        const basketItems = response.data

        let itemList = ""
        for (let item of basketItems) {
            itemList += item.itemId + ","
        }
        
        if (!itemList) {
            return
        }

        response = await axios.get(SERVER_URL + `/api/item?itemList=${itemList}`)
        const data = response.data
        return {data, basketItems}
    } catch (e) {
        console.log(e)
    }
}

export default fetchBasket