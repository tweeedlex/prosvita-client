import axios from "axios"
import { SERVER_URL } from "../config"

const actionCart = async (action, item) => {
    try {
        const response = await axios.post(SERVER_URL + `/api/basket/${action}?itemId=` + item.id, {}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("user-token"),
            }
        })
    } catch (e) {
        return e
    }
}

export default actionCart