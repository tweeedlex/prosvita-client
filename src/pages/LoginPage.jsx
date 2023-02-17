import React, { useState } from 'react'
import styles from './css/Authorization.module.css'
import {SERVER_URL} from "../config"
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

export const LoginPage = observer(() => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const login = async (e) => {
    try {
      e.preventDefault()
      const response = await axios.post(SERVER_URL + "/api/user/login", {
        email,
        password
      })

      localStorage.setItem("user-token", response.data)
      navigate("/")
    } catch (e) {
      alert(e.response.data.message)
    }
  }

  return (
    <form className={styles.authform}>
      <h2 className={styles.h2}>Вхід</h2>
      <input placeholder='Електронна пошта' onChange={(e) => { setEmail(e.target.value) }} value={email} type="email" />
      <input placeholder='Пароль' onChange={(e) => { setPassword(e.target.value) }} value={password} type="password" />
      <button className='add' onClick={(e) => login(e)}>Вхід</button>
    </form>
  )
})
