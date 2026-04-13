# Notatapp

En enkel fullstack applikasjon for notater og todo-lister. Løsningen gir:

- Lagre og redigere notater
- Lage todo-lister med egne oppgaver under hver todo
- Slette, oppdatere og holde styr på ferdige todoer og tasks
- En Node.js backend med SQLite-database
- En ren frontend i `client/` med vanilje JavaScript

## Installere og starte serveren

1. Koble til serveren:
   ```bash
   ssh server@192.168.20.60
   ```
2. Clon repoet:
   ```bash
   git clone https://github.com/aaaka001/notatapp.git
   ```
3. Gå til server-mappen og installer avhengigheter:
   ```bash
   cd notatapp/server
   npm install
   ```
4. Start serveren:
   ```bash
   node server.js
   ```

Serveren kjører da på:

- `http://192.168.20.60:3000` hvis du kjører på serveren
- `http://localhost:3000` hvis du kjører lokalt

## Starte klienten

Frontend-filen ligger i `client/` og serveres automatisk av backend når serveren kjører.

1. Åpne nettleseren og gå til:
   ```text
   http://192.168.20.60:3000
   ```
2. Bruk notat- og todo-grensesnittet direkte i nettleseren.

## API-eksempler

Alle API-kall må sende med headeren `x-api-key: 8080`.

### Hente alle noter

```bash
curl -H "x-api-key: 8080" http://192.168.20.60:3000/notes
```

### Opprette notat

```bash
curl -X POST -H "Content-Type: application/json" -H "x-api-key: 8080" \
  -d '{"title":"Handleliste","content":"Melk, brød, egg"}' \
  http://192.168.20.60:3000/notes
```

### Opprette todo

```bash
curl -X POST -H "Content-Type: application/json" -H "x-api-key: 8080" \
  -d '{"title":"Ukens ærend","completed":0}' \
  http://192.168.20.60:3000/todos
```

### Legge til oppgave i todo

```bash
curl -X POST -H "Content-Type: application/json" -H "x-api-key: 8080" \
  -d '{"text":"Kjøp melk","done":0}' \
  http://192.168.20.60:3000/todos/1/tasks
```

### Oppdatere task

```bash
curl -X PATCH -H "Content-Type: application/json" -H "x-api-key: 8080" \
  -d '{"text":"Kjøp melk og brød","done":1}' \
  http://192.168.20.60:3000/tasks/1
```

### Slette todo

```bash
curl -X DELETE -H "x-api-key: 8080" http://192.168.20.60:3000/todos/1
```

### Slette task

```bash
curl -X DELETE -H "x-api-key: 8080" http://192.168.20.60:3000/tasks/1
```

## Struktur

- `server/` - Node.js backend og SQLite-database
- `client/` - HTML, CSS og JavaScript for frontend
- `README.md` - denne dokumentasjonen