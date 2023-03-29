import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";

export const register = async (email, password) => {
    const response = await $host.post('api/user/registration', {email, password})
    return response
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('user-token', data)
    return jwt_decode(data)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('user-token', data)
    return jwt_decode(data)
}
