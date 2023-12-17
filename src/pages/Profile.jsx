import React, { useEffect, useState } from 'react'
import styles from './css/Profile.module.css'
import {getUserOrders} from "../http/orderAPI"
import { Order } from '../components/admin-components/Order'

export const Profile = () => {
  const [orders, setOrders] = useState([])

  const getOrders = async () => {
    const orders = await getUserOrders();
    setOrders(orders);
  }

  useEffect(() => {
    getOrders();
  }, [])

  return (
    <div>
      <h2 className={styles.h2}>Особистий кабінет</h2>
      <h3 className={styles.h3}>Мої завмовлення</h3>
      <div className={styles.orders}>
        {
          orders && orders.length > 0 
          ? orders.map(order => <Order order={order} notManager={true} key={order.id}/>)
          : <p className={styles.subtitle}>Тут буде з'являтися інформація про оформлені вами замовлення</p>
        }
      </div>
    </div>
  )
}
