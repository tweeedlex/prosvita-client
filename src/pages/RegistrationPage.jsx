import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SERVER_URL } from '../config'
import styles from './css/Authorization.module.css'

export const RegistrationPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatedPassword, setRepeatedPassword] = useState("")

  const navigate = useNavigate()

  const register = async (e) => {
    e.preventDefault()

    try {
      if (password !== repeatedPassword) {
        return alert("Паролі не збігаються")
      }

      const response = await axios.post(SERVER_URL + "/api/user/registration", {
        email,
        password
      })

      if (response.data.message) {
        alert(response.data.message)
        navigate("/login")
      }

    } catch (e) {
      let message = ""
      for (let error of e.response.data.errors) {
        message += `${error.param.charAt(0).toUpperCase() + error.param.slice(1)} is invalid\n`
      }
      alert(message)
    }
  }

  return (
    <form className={styles.authform}>
      <h2 className={styles.h2}>Реєстрація</h2>
      <input placeholder='Електронна пошта' onChange={(e) => { setEmail(e.target.value) }} value={email} type="email" />
      <input placeholder='Пароль' onChange={(e) => { setPassword(e.target.value) }} value={password} type="password" />
      <input placeholder='Повтор паролю' onChange={(e) => { setRepeatedPassword(e.target.value) }} value={repeatedPassword} type="password" />
      <div style={{display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center"}}>
        <Link style={{ fontSize: "20px" }} to={"/login"}>
          Маєте аккаунт? <span style={{ textDecoration: "underline", fontSize: "20px" }}>Вхід</span>
        </Link>
        <button style={{fontSize: "20px"}} className='add' onClick={(e) => register(e)}>Зареєструватися</button>
      </div>
    </form>
  )
}
