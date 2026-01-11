# 🚀 Deploy dell'App Poo-Poo Dog Tracker

## 📱 Accedi all'app da qualsiasi dispositivo

L'app è disponibile online a questo indirizzo:

**https://gpleoo.github.io/Poo-Poo-Dog-V01/**

Puoi aprire questo link da:
- 📱 Smartphone (iPhone, Android)
- 💻 Computer (Windows, Mac, Linux)
- 📱 Tablet (iPad, Android)

## ⚙️ Come funziona il deploy automatico

Ogni volta che carichi modifiche al branch **main** su GitHub, l'app viene automaticamente aggiornata online tramite GitHub Actions.

### Passi per aggiornare l'app online:

1. **Fai le modifiche al codice**
2. **Committa e pusha al branch main**:
   ```bash
   git add .
   git commit -m "Descrizione modifiche"
   git push origin main
   ```
3. **Aspetta 2-3 minuti** - GitHub Actions farà automaticamente il build e deploy
4. **Ricarica la pagina** nel browser per vedere le modifiche

## 🔧 Prima configurazione (SOLO LA PRIMA VOLTA)

Se è la prima volta che usi GitHub Pages per questo repository, devi abilitarlo:

1. Vai su **GitHub.com** → Il tuo repository **Poo-Poo-Dog-V01**
2. Clicca su **Settings** (Impostazioni)
3. Nel menu a sinistra, clicca su **Pages**
4. In "Source", seleziona:
   - **Source**: GitHub Actions
5. Salva e aspetta qualche minuto
6. L'app sarà disponibile all'indirizzo sopra

## 📲 Installare l'app sul cellulare (PWA)

Puoi aggiungere l'app alla schermata principale del tuo smartphone:

### Su iPhone/iPad:
1. Apri l'app in Safari
2. Tocca l'icona "Condividi" (quadrato con freccia verso l'alto)
3. Scorri e tocca "Aggiungi a Home"
4. Tocca "Aggiungi"

### Su Android:
1. Apri l'app in Chrome
2. Tocca il menu (3 puntini)
3. Tocca "Aggiungi a schermata Home"
4. Tocca "Aggiungi"

Ora l'app si aprirà come una vera app nativa! 📱

## 🛠️ Sviluppo locale (per modifiche)

Se vuoi testare modifiche in locale prima di caricarle:

```bash
# Avvia server di sviluppo
npm run dev

# Apri http://localhost:3000
```

## 🌐 Domini personalizzati (opzionale)

Se vuoi usare un dominio personalizzato tipo `poopoodog.com`:

1. Compra un dominio
2. Aggiungi un file `CNAME` nella cartella `dist/` con il tuo dominio
3. Configura i DNS del dominio per puntare a GitHub Pages

## ❓ Risoluzione problemi

### L'app non si aggiorna dopo il push
- Vai su GitHub.com → Actions → Verifica che il workflow sia completato
- Aspetta 2-3 minuti dopo il completamento
- Svuota la cache del browser (Ctrl+F5 o Cmd+Shift+R)

### Errore 404
- Verifica che GitHub Pages sia abilitato nelle Settings
- Verifica che il workflow sia completato senza errori
- Controlla che il branch "main" esista

### L'app non funziona offline
- Aggiungi Service Worker per PWA (funzionalità avanzata)

## 📞 Supporto

Per problemi o domande, apri una Issue su GitHub!
