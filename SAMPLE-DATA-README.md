# 🧪 Dati di Test / Sample Data

Questo file contiene **1200 cacche di esempio** per testare l'app Poo-Poo Dog Tracker.

## 📦 File Disponibili

- **`sample-backup-1200-poops.json`** - Backup con 1200 cacche nella regione Lazio (Roma)

## 🎯 Come Importare i Dati di Test

### Passo 1: Scarica il file
Se stai usando l'app da GitHub, scarica il file `sample-backup-1200-poops.json`

### Passo 2: Apri l'app
Avvia l'app con `npm run dev` e apri http://localhost:3000

### Passo 3: Vai nelle Impostazioni
Clicca sul pulsante **⚙️ Impostazioni** in alto a destra

### Passo 4: Importa il Backup
1. Scorri fino alla sezione **"💾 Backup e Ripristino"**
2. Clicca su **"📂 Importa Backup"**
3. Seleziona il file **`sample-backup-1200-poops.json`**
4. Conferma l'importazione

### Passo 5: Esplora i Dati
- La mappa mostrerà tutte le 1200 cacche nella regione Lazio
- I marker saranno raggruppati in cluster
- Puoi filtrare per tipo, data, cibo
- Visualizzare statistiche e grafici
- Esportare PDF

## 📊 Contenuto del Backup

### Cacche (1200 totali)
- **Coordinate**: Regione Lazio (Roma e dintorni)
  - Latitudine: 41.85 - 42.05
  - Longitudine: 12.35 - 12.65
- **Periodo**: Ultimi 6 mesi
- **Tipi**: Healthy, Soft, Diarrhea, Hard, Blood, Mucus
- **Tutti i campi compilati**: dimensione, colore, odore, cibo, ore dal pasto, note

### Profilo Cane
- **Nome**: Bobby
- **Razza**: Labrador Retriever
- **Peso**: 15.5 kg
- **Età**: 4 anni e 8 mesi
- **Sesso**: Maschio
- **Microchip**: 380260000123456
- **Allergie**: Glutine
- **Veterinario**: Clinica Veterinaria San Marco (Roma)
- **Vaccinazioni**: Tutte configurate con promemoria

### Cibi Tracciati (14 tipi)
- Crocchette al pollo
- Crocchette al manzo
- Carne cruda
- Pollo bollito
- Riso e pollo
- Cibo umido al salmone
- E altri...

## 🔄 Rigenerare i Dati

Se vuoi rigenerare nuovi dati casuali:

```bash
node generate-sample-data.js > nuovo-backup.json
```

Puoi modificare lo script `generate-sample-data.js` per:
- Cambiare il numero di cacche (riga 154)
- Modificare le coordinate (LAZIO_BOUNDS)
- Aggiungere nuovi cibi, note, ecc.

## ⚠️ Note Importanti

- L'importazione **sovrascriverà** tutti i dati esistenti nell'app
- Fai un backup dei tuoi dati reali prima di importare dati di test
- Le coordinate sono casuali ma realistiche nella zona di Roma
- Circa il 20% delle cacche sono inserimenti manuali (senza GPS)

## 🎨 Cosa Testare

Con questi dati puoi testare:

1. **Performance con grandi dataset**
   - Cluster di marker funzionano correttamente?
   - La mappa rimane fluida?

2. **Filtri e Statistiche**
   - Filtra per periodo (oggi, settimana, mese)
   - Filtra per tipo di cacca
   - Filtra per cibo
   - Visualizza grafici

3. **Export PDF**
   - Genera report completi
   - Verifica che includa tutti i dati filtrati

4. **Grafici**
   - Distribuzione tipi
   - Andamento temporale
   - Correlazione cibo-problemi

5. **Promemoria Vaccinazioni**
   - Badge delle notifiche
   - Lista scadenze

Buon testing! 🐕💩
