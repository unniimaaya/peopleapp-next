import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const Home = ({ people, nextPage, prevPage }) => {
  const router = useRouter();

  const currentPage = parseInt(router.query.page) || 1;
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleFavorite = (person) => {
    const updatedFavorites = favorites.includes(person.name)
      ? favorites.filter((fav) => fav !== person.name)
      : [...favorites, person.name];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className={styles.container}>
      <h1>Star Wars Characters</h1>
      <ul className={styles.list}>
        {people.map((person, index) => (
          <div className={styles.displayflex} key={index?.url}>
            <li className={styles.listItem}>
              <Link href={`/person/${person.name}`} legacyBehavior>
                <a> {person.name}</a>
              </Link>
            </li>
            <span onClick={() => handleFavorite(person)}>
              {favorites.includes(person.name) ? <FaHeart /> : <FaRegHeart />}
            </span>
          </div>
        ))}
      </ul>
      <div className={styles.pagination}>
        {prevPage && (
          <button
            className={styles.button_style}
            onClick={() => router.push(`/?page=${currentPage - 1}`)}
          >
            Previous
          </button>
        )}
        {nextPage && (
          <button
            className={styles.button_style}
            onClick={() => router.push(`/?page=${currentPage + 1}`)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const res = await axios.get(`https://swapi.dev/api/people?page=${page}`);
  const { results, next, previous } = res.data;

  return {
    props: {
      people: results,
      nextPage: next,
      prevPage: previous,
    },
  };
}

export default Home;
