import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { SERVER_URL } from "../../config";
import { Modal } from "../Modal";
import { OrderItemCard } from "../OrderItemCard";
import styles from "../../pages/css/OrdersPage.module.css";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Keyboard, Pagination, Navigation } from "swiper";

export const Order = ({ order, notManager }) => {
  const [itemsModalVisible, setItemsModalVisible] = useState(false);
  const [completedModalVisible, setCompletedModalVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const checkMobile = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", () => {
      checkMobile();
    });
  }, []);

  let sum = 0;

  let itemIds = order.items.map((item) => item?.id);

  const loadItems = async () => {
    const response = await axios.get(
      SERVER_URL + "/api/item?itemList=" + itemIds
    );
    return response.data;
  };

  const setOrderCompleted = async () => {
    await axios.put(
      SERVER_URL + "/api/order?id=" + order.id,
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token"),
        },
      }
    );
    setCompleted(true);
    setCompletedModalVisible(false);
  };

  const openModal = () => {
    setItemsModalVisible(true);
    loadItems().then((data) => setItems(data));
  };

  return (
    <div className={`${styles.order} ${notManager === true ? styles.userOrder : ""}`} key={order.id}>
      <div className={styles.orderInfo}>
        <p>ID замовлення: {order.id}</p>
        <p>{order.phone}</p>
        <p>{order.telegram}</p>
        <p>{order.email}</p>
        <div className={styles.orderButtons}>
          <button
            className={"button-transparent " + styles.orderButton}
            onClick={() => openModal()}
          >
            Замовлені товари
          </button>
          {notManager === true ? null : (
            order.completed || completed ? (
              <p>Виконано</p>
            ) : (
              <button
                className={"button-transparent " + styles.orderButton}
                onClick={() => setCompletedModalVisible(true)}
              >
                Позначити як виконане ✔
              </button>
            ))
          }
          
        </div>
      </div>

      <div>
        <Modal visible={itemsModalVisible} setVisible={setItemsModalVisible}>
          <p className={styles.sum}>
            Сума замовлення: {items.forEach((item) => (sum += item.price * order.items.find((amountItem) => amountItem.id === item.id).amount))}
            {sum}₴
          </p>

          <Swiper
            slidesPerView={isMobile ? 2 : 5}
            spaceBetween={isMobile ? 7.5 : 30}
            keyboard={{
              enabled: true,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Keyboard, Pagination, Navigation]}
            className={styles.slider}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id} className={styles.slide}>
                <OrderItemCard
                  key={item.id}
                  item={item}
                  amounts={order.items}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Modal>

        <Modal
          visible={completedModalVisible}
          setVisible={setCompletedModalVisible}
        >
          <div className={styles.confirm}>
            <p>Ви впевнені, що це завмовлення виконане?</p>
            <div className={styles.buttons}>
              <button
                className="button-transparent"
                onClick={() => setOrderCompleted()}
              >
                Так
              </button>
              <button
                className="button-transparent"
                onClick={() => setCompletedModalVisible(false)}
              >
                Ні
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
