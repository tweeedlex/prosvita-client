import React, { useState } from "react";
import { SERVER_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Modal } from "./Modal";
import modalStyles from "./css/Modal.module.css";

export const Login = observer(({ isOpened, setIsOpened, getEmail, getRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(SERVER_URL + "/api/user/login", {
        email,
        password,
      });

      localStorage.setItem("user-token", response.data);
      setIsOpened(false)
      getEmail()
      getRole()
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  return (
    <Modal zIndex={12} visible={isOpened} setVisible={setIsOpened}>
      <form
        className={modalStyles.formDefault}
      >
        <input
          placeholder="Електронна пошта"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          type="email"
          className={modalStyles.input}
        />
        <input
          placeholder="Пароль"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          type="password"
          className={modalStyles.input}
        />
        <button className={modalStyles.action} onClick={(e) => login(e)}>Вхід</button>
      </form>
    </Modal>
  );
});
