import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Item } from '../components/Item'
import { SERVER_URL } from '../config'
import styles from "./css/BrandPage.module.css"

export const BrandPage = () => {
  const location = useLocation()
  const brandId = location.pathname.split("/")[2]

  const [brandItems, setBrandItems] = useState([])

  useEffect(() => {
    loadData()
  }, []);

  const loadData = async () => {
    const response = await axios.get(SERVER_URL + "/api/item?brandId=" + brandId)
    setBrandItems(response.data.rows)
  }

// // // // 

  return (
    <div className="cards">
      {brandItems.map(item => 
        <Item key={item.id} item={item} />                
      )}
    </div>
  )
}
