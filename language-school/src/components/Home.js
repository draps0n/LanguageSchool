import React from "react";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <h1>Szkoła Językowa</h1>
      <p>Witamy w naszej szkole językowej!</p>
      <section className="about-section">
        <h2>O nas</h2>
        <p>
          Nasza szkoła językowa oferuje szeroki wybór kursów językowych dla
          wszystkich grup wiekowych i poziomów zaawansowania. Nasi doświadczeni
          nauczyciele pomogą Ci osiągnąć Twoje cele językowe w przyjaznej i
          wspierającej atmosferze.
        </p>
      </section>
      <section className="courses-section">
        <h2>Nasze kursy</h2>
        <ul>
          <li>Kursy angielskiego</li>
          <li>Kursy niemieckiego</li>
          <li>Kursy hiszpańskiego</li>
          <li>Kursy francuskiego</li>
          <li>Kursy włoskiego</li>
        </ul>
      </section>
      <section className="contact-section">
        <h2>Kontakt</h2>
        <p>
          Adres: ul. Językowa 123, 00-001 Warszawa
          <br />
          Telefon: 123-456-789
          <br />
          Email: kontakt@szkolajezykowa.pl
        </p>
      </section>
    </div>
  );
}

export default Home;
