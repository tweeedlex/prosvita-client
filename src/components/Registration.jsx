import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import React, { useState, useContext } from "react";
import modalStyles from "./css/Modal.module.css";
import { Modal } from "./Modal";
import { Context } from "../index";
import { register } from "../http/userAPI";

export const Registration = ({ isOpened, setIsOpened }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const { user } = useContext(Context);

  const registerHandler = async (e) => {
    try {
      if (password !== repeatedPassword) {
        return alert("Паролі не збігаються");
      }

      if (password.length > 32 || password.length < 6) {
        return alert("Пароль має містити від 6 до 32 символів");
      }

      e.preventDefault();

      const credentials = await createUserWithEmailAndPassword(user.auth, email, password);
      await register(credentials.user.uid, email);
      sendEmailVerification(user.auth.currentUser)
        .then(() => {
          alert(
            "На вашу електронну пошту надіслано листа з підтвердженням. Після підтвердження вам розблокуються додаткові функції"
          );
        })
        .catch((error) => {
          console.log(error);
          alert("Сталася помилка! Перевірте правильність введених даних.")
        });
      setIsOpened(false);
    } catch (e) {
      alert("Сталася помилка! Перевірте правильність введених даних.")
      console.log(e)
    }
  };

  return (
    <Modal zIndex={12} visible={isOpened} setVisible={setIsOpened}>
      <div className={modalStyles.formDefault}>
        <input
          placeholder="Електронна пошта"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          type="email"
          className={modalStyles.input}
        />
        <p className={modalStyles.inputLabel}>Від 6 до 32 символів</p>
        <input
          placeholder="Пароль"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          type="password"
          className={modalStyles.input}
        />
        <input
          placeholder="Повтор паролю"
          onChange={(e) => {
            setRepeatedPassword(e.target.value);
          }}
          value={repeatedPassword}
          type="password"
          className={modalStyles.input}
        />
        <button
          className={modalStyles.action}
          onClick={(e) => registerHandler(e)}
        >
          Зареєструватися
        </button>
      </div>
    </Modal>
  );
};
