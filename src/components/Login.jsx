import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "./Modal";
import modalStyles from "./css/Modal.module.css";
import { Context } from "../index";
import { login } from "../http/userAPI";

export const Login = observer(
  ({ isOpened, setIsOpened, getEmail, getRole }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {user} = useContext(Context);

    const loginHandler = async (e) => {
      try {
        e.preventDefault();
        const data = await login(email, password);
        user.setUser(data);
        user.setIsAuth(true);

        setIsOpened(false)
      } catch (e) {
        alert(e.reponse.data.message);
      }
    };

    return (
      <Modal zIndex={12} visible={isOpened} setVisible={setIsOpened}>
        <form className={modalStyles.formDefault}>
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
          <button
            className={modalStyles.action}
            onClick={(e) => loginHandler(e)}
          >
            Вхід
          </button>
        </form>
      </Modal>
    );
  }
);
