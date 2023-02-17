import React, { useEffect, useState } from "react";
import { Brands } from "../components/Brands";
import { Item } from "../components/Item";
import axios from "axios";
import { SERVER_URL } from "../config";
import { Types } from "../components/Types";
import { countAndSetPages } from "../utils/countAndSetPages";
import { useLocation, useSearchParams } from "react-router-dom";

import styles from "./css/MainPage.module.css";

export const MainPage = () => {
  const [items, setItems] = useState([]);

  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    if (location.search.split("?")[1]) {
      loadItemsByType();
    } else {
      loadItems().then(() => setIsLoading(false));
    }
  }, []);

  const loadItems = async () => {
    const response = await axios.get(SERVER_URL + "/api/item");
    setItems(response.data.rows);
    countAndSetPages(response, setPages);
  };

  const loadItemsByType = async () => {
    let id = +location.search.split("?")[1];
    setSelectedType(id);
    const response = await axios.get(SERVER_URL + `/api/item?typeId=${id}`);
    setItems(response.data.rows);
  };

  const resetFilters = () => {
    loadItems();
    setSelectedBrand(null);
    setSelectedType(null);
  };

  const changePage = async (page) => {
    setSelectedPage(page);
    const response = await axios.get(`
      ${SERVER_URL}/api/item?page=${page}
      ${selectedBrand ? `&brandId=${selectedBrand}` : ""}
      ${selectedType ? `&typeId=${selectedType}` : ""}
    `);
    setItems(response.data.rows);
    window.scroll(0, 0);
  };

  const [areFiltersActive, setAreFiltersActive] = useState(false);

  let body = document.querySelector("body");

  const toggleFilters = () => {
    if (areFiltersActive) {
      setAreFiltersActive(false);
      return (body.classList = "");
    }
    setAreFiltersActive(true);
    console.log(body);
    body.classList = "lock";
  };

  return (
    <div className={styles.catalog}>
      <div className={"catalog__container " + styles.container}>
        <div className={styles.filters}>
          <div className={styles.category}>
            <h3>Типи</h3>
            <Types
              setSelectedPage={setSelectedPage}
              setPages={setPages}
              setItems={setItems}
              selectedType={selectedType}
              selectedBrand={selectedBrand}
              setSelectedType={setSelectedType}
            />
          </div>
          <div className={styles.category}>
            <h3>Викладачі</h3>
            <Brands
              setSelectedPage={setSelectedPage}
              setPages={setPages}
              setItems={setItems}
              selectedBrand={selectedBrand}
              selectedType={selectedType}
              setSelectedBrand={setSelectedBrand}
            />
          </div>
          <button onClick={() => resetFilters()} className={styles.reset}>Скинути</button>
        </div>
        <div className={styles.items}>
          <div className={styles.cards}>
            {isLoading ? (
              <div className="loader"></div>
            ) : items.length ? (
              items.map((item) => <Item key={item.id} item={item} />)
            ) : (
              <p>Відстуні товари за Вашими фільтрами</p>
            )}
          </div>
          <ul className={styles.pagination}>
            {pages.length > 1 &&
              pages.map((page) => (
                <li
                  key={page}
                  className={`${styles.page} ${page === selectedPage ? styles.selected : ""}`}
                >
                  <button onClick={() => changePage(page)}>{page}</button>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* <div>
        <button onClick={() => toggleFilters()}>
          <span>Фільтри</span>
        </button>

        <div className={`filters ${areFiltersActive && "active"}`}>
          <div>
            <button onClick={() => resetFilters()}>Скинути фільтри</button>
            <button onClick={() => toggleFilters()}></button>
          </div>

          <Types
            setSelectedPage={setSelectedPage}
            setPages={setPages}
            setItems={setItems}
            selectedType={selectedType}
            selectedBrand={selectedBrand}
            setSelectedType={setSelectedType}
          />

          <h3 style={{ margin: "0 0 10px 0" }} className="black-tablet">
            Викладачі
          </h3>
          <Brands
            setSelectedPage={setSelectedPage}
            setPages={setPages}
            setItems={setItems}
            selectedBrand={selectedBrand}
            selectedType={selectedType}
            setSelectedBrand={setSelectedBrand}
          />
        </div>

        <div className="cards cards__main">
          {isLoading ? (
            <div className="loader"></div>
          ) : items.length ? (
            items.map((item) => (
              <Item classN="card__main" key={item.id} item={item} />
            ))
          ) : (
            <div style={{ textAlign: "center", width: "100%" }}>
              Відстуні товари за Вашими фільтрами
            </div>
          )}
        </div>
      </div>

      <ul className="pages">
        {
          pages.length > 1 &&
          pages.map(page =>
            <li key={page} className={`page ${page === selectedPage ? "selected" : ""}`}>
              <button onClick={() => changePage(page)} className='button-default'>
                {page}
              </button>
            </li>
          )}
      </ul> */}
    </div>
  );
};
