# 🐕 Poo-Poo Dog Tracker 💩

**Versione 2.0** - Professional Edition

Una web app professionale per tracciare e monitorare la salute intestinale del tuo cane durante le passeggiate!

## ✨ Caratteristiche Principali

### 📍 Tracciamento GPS Avanzato
- **Mappa Interattiva**: Visualizza la tua posizione in tempo reale
- **Tracking GPS**: Posizione tracciata automaticamente con throttling intelligente
- **Auto-Center**: La mappa segue automaticamente i tuoi movimenti
- **Clustering**: Raggruppa automaticamente i marker vicini per miglior visualizzazione
- **Inserimento Manuale**: Aggiungi cacche senza GPS con data/ora personalizzabile

### 🐕 Profilo Completo del Cane
- **Dati Anagrafici**: Nome, data nascita, peso, razza, sesso, microchip
- **Salute**: Malattie croniche, allergie (alimentari/farmaci), farmaci in corso, interventi chirurgici
- **Veterinario**: Contatti completi della clinica veterinaria
- **Vaccinazioni**: Tracciamento vaccinazioni e antiparassitari con promemoria automatici

### 💩 Monitoraggio Salute Intestinale
- **Dettagli Completi**: Tipo, dimensione, colore, odore
- **Correlazione Cibo**: Traccia il cibo mangiato e le ore dal pasto
- **Note Riutilizzabili**: Salva note comuni per riutilizzarle
- **Icone SVG Personalizzate**: Diverse cacche per diversi stati di salute

### 📊 Statistiche e Analisi
- **Grafici Interattivi**: Distribuzione tipi, andamento temporale, correlazione cibo-problemi
- **Filtri Avanzati**: Per periodo, tipo, cibo
- **Export PDF**: Report completo con statistiche e raccomandazioni
- **Backup/Ripristino**: Esporta e importa tutti i dati in JSON

### 🔒 Privacy Totale
- **Dati Locali**: Tutto salvato in LocalStorage, nessun server esterno
- **Nessun Tracking**: Zero cookie di terze parti
- **Open Source**: Codice completamente trasparente

## 🛠️ Stack Tecnologico

### Frontend
- **HTML5** + **CSS3** con design responsive
- **JavaScript ES6+** con architettura modulare
- **Vite** - Build tool moderno e veloce

### Librerie
- **Leaflet.js** - Mappe interattive
- **Leaflet.markercluster** - Clustering marker
- **Chart.js** - Grafici statistici
- **jsPDF** + **jsPDF-AutoTable** - Export PDF

### Architettura
- **Modular Design**: Servizi separati per ogni funzionalità
- **Service Pattern**: MapService, DataService, ChartService, ExportService, NotificationService, UIManager
- **Event-Driven**: Callbacks e gestione eventi centralizzata
- **Error Handling**: Validazione e gestione errori robusta

## 📦 Installazione e Utilizzo

### Sviluppo

```bash
# Installa dipendenze
npm install

# Avvia dev server (http://localhost:3000)
npm run dev

# Build per produzione
npm run build

# Preview build di produzione
npm run preview
```

### Produzione

1. Esegui `npm run build`
2. Copia la cartella `dist/` sul tuo server web
3. Apri `index.html` nel browser

## 🏗️ Struttura del Progetto

```
Poo-Poo-Dog-V01/
├── src/
│   ├── js/
│   │   ├── services/
│   │   │   ├── MapService.js          # Gestione mappa e GPS
│   │   │   ├── DataService.js         # Gestione dati e storage
│   │   │   ├── ChartService.js        # Grafici statistici
│   │   │   ├── ExportService.js       # Export PDF e backup
│   │   │   ├── NotificationService.js # Toast e notifiche
│   │   │   └── UIManager.js           # Gestione UI e modali
│   │   ├── utils/
│   │   │   ├── constants.js           # Costanti applicazione
│   │   │   ├── helpers.js             # Funzioni helper
│   │   │   └── validators.js          # Validatori dati
│   │   └── main.js                    # Entry point applicazione
│   └── css/
│       └── styles.css                 # Stili applicazione
├── public/                            # Asset statici
├── dist/                              # Build di produzione
├── index.html                         # HTML principale
├── package.json                       # Dipendenze npm
├── vite.config.js                     # Configurazione Vite
└── README.md                          # Questo file
```

## 🎮 Guida Utilizzo

### Primo Avvio
1. Inserisci i dati del tuo cane nel profilo
2. Permetti l'accesso alla posizione GPS
3. Inizia a camminare!

### Durante la Passeggiata
1. **Con GPS**: Premi "Cacca Qui!" quando il cane fa i bisogni
2. **Manuale**: Usa "Manuale" per inserire cacche passate con data/ora
3. Compila i dettagli (tipo, dimensione, colore, odore, cibo)
4. Salva!

### Analisi Dati
1. Apri "Filtri e Statistiche" (📊)
2. Filtra per periodo, tipo, cibo
3. Visualizza grafici e tendenze
4. Esporta PDF per il veterinario

### Promemoria
- Configura date vaccinazioni nel profilo
- Ricevi notifiche 7 giorni prima della scadenza
- Tieni traccia degli antiparassitari

## 📱 Compatibilità

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & iOS)
- ✅ Progressive Web App ready
- ⚠️ Richiede GPS per tracciamento (opzionale)
- ⚠️ Richiede JavaScript abilitato

## 🔧 Configurazione

### GPS
- Attiva/disattiva da Impostazioni (⚙️)
- Supporta richiesta permessi manuale
- Fallback graceful se GPS non disponibile

### Privacy
- Tutti i dati in LocalStorage
- Export/Import per backup
- Cancellazione completa dati disponibile

## 🚀 Miglioramenti v2.0

### Architettura
- ✅ Modularizzazione completa del codice
- ✅ Pattern MVC/Service-oriented
- ✅ Build system professionale (Vite)
- ✅ Tree-shaking e code-splitting
- ✅ TypeScript-ready structure

### Performance
- ✅ Throttling GPS updates
- ✅ Debouncing eventi UI
- ✅ Lazy loading modali
- ✅ Cluster markers per performance
- ✅ Minificazione e ottimizzazione bundle

### UX/Accessibilità
- ✅ ARIA labels su tutti i controlli
- ✅ Keyboard navigation support
- ✅ Responsive design migliorato
- ✅ Toast notifications professionali
- ✅ Validazione input robusta

### Funzionalità
- ✅ Inserimento manuale cacche
- ✅ Promemoria vaccinazioni
- ✅ Export PDF professionale
- ✅ Backup/Restore completo
- ✅ Note riutilizzabili

## 📝 Note per Sviluppatori

### Aggiungere un nuovo servizio

```javascript
// src/js/services/MyService.js
export class MyService {
  constructor(dependencies) {
    // Initialize
  }

  myMethod() {
    // Implementation
  }
}

// src/js/main.js
import { MyService } from './services/MyService.js';

this.myService = new MyService(dependencies);
```

### Aggiungere una nuova validazione

```javascript
// src/js/utils/validators.js
export function validateMyData(data) {
  const errors = [];
  // Add validation logic
  return { isValid: errors.length === 0, errors };
}
```

## 🐾 Copyright

© 2024-2025 **Giampietro Leonoro & Monica Amato** - Tutti i Diritti Riservati

**PROPRIETARY AND CONFIDENTIAL**
Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

## 🤝 Contributi

Per richieste di funzionalità o bug report, contattare gli autori.

---

Buone passeggiate con il tuo amico a quattro zampe! 🐕❤️
