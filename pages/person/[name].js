import axios from "axios";
import styles from "@/styles/person.module.css";

const Person = ({ person, movies }) => {
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>{person.name}</h1>
        <p className={styles.ptitle}>
          <strong>Height:</strong> {person.height}
        </p>
        <p className={styles.ptitle}>
          <strong>Mass:</strong> {person.mass}
        </p>
        <p className={styles.ptitle}>
          <strong>Hair Color:</strong> {person.hair_color}
        </p>
        <p className={styles.ptitle}>
          <strong>Skin Color:</strong> {person.skin_color}
        </p>
        <p className={styles.ptitle}>
          <strong>Eye Color:</strong> {person.eye_color}
        </p>
        <p className={styles.ptitle}>
          <strong>Birth Year:</strong> {person.birth_year}
        </p>
        <p className={styles.ptitle}>
          <strong>Gender:</strong> {person.gender}
        </p>
      </div>
      <div className={styles.movie_card}>
        <h1>Movies</h1>
        <ul className={styles.list_styles_movie}>
          {movies.map((movie) => (
            <li key={movie.url}>{movie.title}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { name } = context.params;
  const res = await axios.get(`https://swapi.dev/api/people/?search=${name}`);
  const person = res.data.results[0];

  const moviePromises = person.films.map((filmUrl) => axios.get(filmUrl));
  const movies = await Promise.all(moviePromises).then((responses) =>
    responses.map((response) => response.data)
  );

  return {
    props: {
      person,
      movies,
    },
  };
}

export default Person;
