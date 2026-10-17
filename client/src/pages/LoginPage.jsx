import React from "react";
import { Link } from "react-router-dom";
import { Arrow, Kicker } from "../components/PageHero.jsx";
import styles from "./LoginPage.module.css";

function LoginPage() {
  return (
    <main className={styles.loginPage}>
      <section className={styles.loginPanel} aria-labelledby="login-title">
        <div className={styles.loginMark} aria-hidden="true">A</div>
        <Kicker hero>ASSETKOUNT / WORKSPACE ACCESS</Kicker>
        <h1 id="login-title">Your workspace access starts with your administrator.</h1>
        <p className={styles.loginLead}>ASSETKOUNT workspace sign-in is not connected on this website yet. We have not asked for or stored a password.</p>
        <div className={styles.loginNotice} role="status">
          <span aria-hidden="true">i</span>
          <p>Already part of an organisation? Contact your workspace administrator for access details. Need help setting up a workspace? Get in touch with our team.</p>
        </div>
        <Link className={styles.loginAction} to="/contact">Contact ASSETKOUNT <Arrow diagonal /></Link>
        <Link className={styles.homeLink} to="/">Return to the website</Link>
      </section>
    </main>
  );
}

export default LoginPage;
