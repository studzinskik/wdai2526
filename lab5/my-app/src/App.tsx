import { Koszyk } from "./components/koszyk/Koszyk";
import { NowyKoszyk } from "./components/koszyk/NowyKoszyk";

import { Licznik } from "./components/liczniki/Licznik";
import { NowyLicznik } from "./components/liczniki/NowyLicznik";

import { Formularz } from "./components/formularze/Formularz";
import { Haslo } from "./components/formularze/Haslo";
import { Logowanie } from "./components/formularze/Logowanie";

import { Ternary } from "./components/inne/Ternary";
import { Aktualizacja } from "./components/inne/Aktualizacja";

import { StudentManager } from "./components/studenci/StudentManager";

import { LicznikEfekty } from "./components/efekty/LicznikEfekty"; 
import { Tytul } from "./components/efekty/Tytul";
import { Odliczanie } from "./components/efekty/Odliczanie";

import { Komentarze } from "./components/produkty/Komentarze";

function App() {
  const sectionStyle = {
    borderBottom: "2px solid #ddd",
    padding: "20px",
    marginBottom: "20px"
  };

  return (
    <div className="App">
      <h1>lab5</h1>

      <section style={sectionStyle}>
        <h2>Zadanie 1: Koszyk</h2>
        <h3>1.1 Koszyk</h3>
        <Koszyk />
        <h3>1.2 Nowy koszyk</h3>
        <NowyKoszyk />
      </section>

      <section style={sectionStyle}>
        <h2>Zadanie 2: Liczniki</h2>
        <h3>2.1 Licznik</h3>
        <Licznik />
        <h3>2.2 Nowy licznik</h3>
        <NowyLicznik />
      </section>

      <section style={sectionStyle}>
        <h2>Zadanie 3: Formularze</h2>
        <h3>3.1 Input mirror</h3>
        <Formularz />
        <h3>3.2 Walidacja hasła</h3>
        <Haslo />
        <h3>3.3 Logowanie</h3>
        <Logowanie />
      </section>

      <section style={sectionStyle}>
        <h2>Zadanie 4: Inne</h2>
        <h3>4.1 Ternary</h3>
        <Ternary />
        <h3>4.2 Aktualizacja stanu</h3>
        <Aktualizacja />
      </section>

      <section style={sectionStyle}>
        <h2>Zadanie 5: Studenci</h2>
        <h3>5.1, 5.2 StudentManager</h3>
        <StudentManager />
      </section>

      <section style={sectionStyle}>
        <h2>Zadanie 6: Efekty</h2>
        <h3>6.1 Licznik z Efektami</h3>
        <LicznikEfekty />
        <h3>6.2 Tytuł strony</h3>
        <Tytul />
        <h3>6.3 Odliczanie</h3>
        <Odliczanie />
      </section>

      <section style={sectionStyle}>
        <h2>Zadanie 7: Produkty</h2>
        <h3>7.1, 7.2 Komentarze</h3>
        <Komentarze />
      </section>
    </div>
  );
}

export default App;