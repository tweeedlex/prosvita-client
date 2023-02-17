import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Item } from '../components/Item'
import { SERVER_URL } from '../config'

export const TypePage = () => {
  const location = useLocation()
  const typeId = location.pathname.split("/")[2]

  const [typeItems, setTypeItems] = useState([])

  useEffect(() => {
    loadData()
  }, []);

  const loadData = async () => {
    const response = await axios.get(SERVER_URL + "/api/item?typeId=" + typeId)
    setTypeItems(response.data.rows)
  }

  return (
    <div className="cards">
      {typeItems.map(item =>
        <Item key={item.id} item={item} />  
      )}
    </div>
  )
}
