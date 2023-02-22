import axios from "axios";
import React, { useEffect, useState } from "react";
import { Order } from "../components/admin-components/Order";
import { SERVER_URL } from "../config";
import { countAndSetPages } from "../utils/countAndSetPages";
import styles from "./css/OrdersPage.module.css";

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async (completed) => {
    let response = {};

    if (completed !== undefined) {
      response = await axios.get(
        SERVER_URL + "/api/order?completed=" + completed,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("user-token"),
          },
        }
      );
    } else {
      response = await axios.get(SERVER_URL + "/api/order", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token"),
        },
      });
    }

    setOrders(response.data.rows);
    countAndSetPages(response, setPages, 10);
  };

  const changePage = async (page) => {
    setSelectedPage(page);
    const response = await axios.get(`${SERVER_URL}/api/order?page=${page}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    });
    setOrders(response.data.rows);
    window.scroll(0, 0);
  };

  return (
    <div className={styles.ordersPage + " container"}>
      <h2>Замовлення</h2>
      <div className={styles.buttons}>
        <button className="button-transparent" onClick={() => loadOrders(true)}>Виконані</button>
        <button className="button-transparent" onClick={() => loadOrders(false)}>Невиконані</button>
        <button className="button-transparent" onClick={() => loadOrders()}>Скинути</button>
      </div>

      <div className={styles.orders}>
        {orders.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </div>

      <ul className="pagination">
        {pages.length > 1 &&
          pages.map((page) => (
            <li
              key={page}
              className={`page ${page === selectedPage ? "selected" : ""}`}
            >
              <button onClick={() => changePage(page)}>{page}</button>
            </li>
          ))}
      </ul>
    </div>
  );
};
