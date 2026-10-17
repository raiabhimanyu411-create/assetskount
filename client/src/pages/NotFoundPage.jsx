import React from "react";
import { Link } from "react-router-dom";
import { AmbientScene, Arrow, Kicker, Lines } from "../components/PageHero.jsx";
import styles from "./Pages.module.css";

function NotFoundPage() {
  return (
    <main className={styles.notFound}>
      <AmbientScene />
      <div className={styles.notFoundCopy}>
        <Kicker hero>PAGE NOT FOUND / 404</Kicker>
        <Lines as="h1" hero lines={["This record", <em key="a">isn't on file.</em>]} />
        <p data-hero-item="">The page may have moved. Head back to ASSETKOUNT and find the right way through.</p>
        <Link className={styles.buttonPrimary} to="/" data-hero-item="" data-magnetic="">Back to the homepage <Arrow /></Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
