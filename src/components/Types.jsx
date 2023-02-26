import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { SERVER_URL } from "../config";
import { fetchBrands, fetchItems, fetchTypes } from "../http/itemAPI";
import { countAndSetPages } from "../utils/countAndSetPages";
import {Context} from "../index"

import styles from "./css/Category.module.css";

export const Types = ({
  setPages,
  setSelectedPage,
  selectedType,
  selectedBrand,
  setSelectedType,
}) => {
  const { item } = useContext(Context);

  const selectType = async (id) => {
    setSelectedType(id);
    const response = await fetchItems(id, selectedBrand, 1, 24)
    item.setItems(response.rows);
    setSelectedPage(1);
    countAndSetPages(response.count, setPages);
  };

  return (
    <ul className={styles.items}>
      {item.types.map((type) => (
        <li
          key={type.id}
          className={`${styles.item} ${
            type.id === selectedType ? styles.selected : ""
          }`}
        >
          <button
            onClick={() => selectType(type.id)}
          >
            {type.name.length < 20 ? type.name : `${type.name.substr(0, 20)}..`}
          </button>
        </li>
      ))}
    </ul>
  );
};
