# Sklep

Sklep na projekt z WDAI

## Technologie

### Frontend
- React
- React Bootstrap

### Backend
- Node.js
- Express.js
- SQLite

## Uruchamianie

1. Instalacja

```bash
npm run install:all
```

2. Ładowanie danych z `fakestoreapi` do bazy 

```bash
cd server
npm run seed
```

3. Start

**UWAGA:** Jeżeli wykonywano krok 2 należy powrócić do głównego katalogu.
```bash
cd ..
```

```bash
npm run dev
```

**http://localhost:5173**

## Konta

| Email | Password | Poziom uprawnień |
|-|-|-|
| `kamil.studzinski@tp.pl` | `prywatnehaslo` | *użytkownik* |
| `piotr.jaroszewicz@tp.pl` | `aminamin` | *administrator* |