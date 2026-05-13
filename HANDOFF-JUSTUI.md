# Ritmas svetainė — perdavimas Justui

Sveikas Justai. Su Claude pagalba parengiau svetainės karkasą Ritmas Pramogų Klubui. Visi failai yra šiame aplanke. Tau reikia padaryti **3 dalykus**, ir svetainę galima diegti.

---

## 1. Įdėti nuotraukas į `assets/images/` aplanką

### Ritmas (jau paruošta Drive aplanke)

Drive: https://drive.google.com/drive/folders/16nW1xbhfNG4HFbNlKOnJWgodqnwv8JQJ

Atsisiųsk 9 failus ir pervadink taip:

| Iš Drive | Pervadinti į |
|----------|--------------|
| `Pagrindine RITMAS.JPG` | `pagrindine-ritmas.jpg` |
| `RITMAS 1.jpg` | `ritmas-1.jpg` |
| `RITMAS 2.jpg` | `ritmas-2.jpg` |
| `RITMAS 3.jpg` | `ritmas-3.jpg` |
| `RITMAS 4.jpg` | `ritmas-4.jpg` |
| `RITMAS 5.JPG` | `ritmas-5.jpg` |
| `RITMAS 6.JPG` | `ritmas-6.jpg` |
| `RITMAS 7.JPG` | `ritmas-7.jpg` |
| `RITMAS 8.JPG` | `ritmas-8.jpg` |

Įdėk juos į: `assets/images/`

### Kitoms erdvėms

HTML faile dabar yra `https://drive.google.com/thumbnail?id=...` URL'ai šioms erdvėms (Drive thumbnail formatas, kuris neveikia patikimai):
- **Uptown Billiards** (`uptown.html`) — 8 nuotraukos
- **Darts & Billiards Vilnius** (`darts-bar.html`) — 8 nuotraukos
- **Darts & Billiards Palanga** (`darts-palanga.html`) — 2 nuotraukos
- **Perkūnas DC** (`perkunas.html`) — 2 nuotraukos
- **Offline Games** (`offline-games.html`) — 2 nuotraukos

Reikia gauti realias nuotraukas iš Darjaus (jis turi galerijas):
- https://yerchak.gallery.photo/gallery/ritmas/
- https://yerchak.gallery.photo/gallery/biliardo-baras/
- https://yerchak.gallery.photo/gallery/wild-turkey-tn80hq/

Padaryk pagal tą patį principą: 1 pagrindinė + 8 vidiniam puslapiui, įdėk į `assets/images/` su pavadinimais tipo `pagrindine-uptown.jpg`, `uptown-1.jpg`...`uptown-8.jpg`.

Pakeisk HTML failuose Drive URL'us į lokalius paths (pvz. `<div class="space-card-img" style="background-image: url('assets/images/pagrindine-uptown.jpg');">`).

---

## 2. Kontaktų forma — pakeisti į realų siuntimą

Šiuo metu forma siunčia per `mailto:` (atidaro vartotojo el. paštą). Nemaloni patirtis.

**Rekomenduoju Formspree** (nemokamas iki 50 užklausų/mėn):
1. Registruokis https://formspree.io su `ritmo@ritmo.lt`
2. Sukurk naują formą, gausi endpoint URL pvz. `https://formspree.io/f/xyzabcde`
3. `index.html` ir `kontaktai.html` form'oje pakeisk:
   ```html
   <form class="form fade-in" id="contact-form">
   ```
   į:
   ```html
   <form class="form fade-in" id="contact-form" action="https://formspree.io/f/xyzabcde" method="POST">
   ```
4. `assets/script.js` faile **ištrink** šitą bloką (mailto fallback):
   ```js
   form?.addEventListener('submit', (e) => { ... });
   ```
   Tada forma siųs tiesiai per Formspree.

---

## 3. Įkelti į hostingą (ritmas.lt)

Visas reikalingas failų rinkinys yra šitame aplanke:
- 10 HTML failų
- `assets/style.css`
- `assets/script.js`
- `assets/images/` (po žingsnio 1)

**Žingsniai:**
1. Prisijunk prie hostingo per FTP / cPanel / file manager
2. Eik į `public_html/` arba kur šaknis ritmas.lt
3. **Backup'ink** esamą turinį jei yra
4. Įkelk visus failus iš šio aplanko (su `assets/` poaplankiu)
5. Patikrink kad `index.html` rodomas atidarius `ritmas.lt`

**SSL**: jei dar nėra HTTPS, įjunk Let's Encrypt per cPanel (paprastai vienu klavišu).

**Cache**: jei klientai turi senesnę versiją cache'e, gali būti naudinga pridėti versijos parametrą prie CSS:
`<link rel="stylesheet" href="assets/style.css?v=2026-05-13">`

---

## Failų struktūra

```
ritmas-svetaine/
├── index.html              # Pagrindinis
├── ritmas.html             # Renginių erdvė (LED šokių aikštelė)
├── uptown.html             # Uptown Billiards
├── offline-games.html      # Offline Games (431 m²)
├── darts-bar.html          # Darts & Billiards Vilnius
├── darts-palanga.html      # Darts & Billiards Palanga
├── perkunas.html           # Perkūnas DC
├── vilko-kasnis.html       # Vilko Kąsnis catering
├── retrobus.html           # RetroBus
├── kontaktai.html          # Kontaktai
├── README.md               # Bendras README
├── HANDOFF-JUSTUI.md       # Šis failas
└── assets/
    ├── style.css           # Visi stiliai
    ├── script.js           # UI logika
    └── images/             # Nuotraukos čia eis
        └── README-DOWNLOAD.md
```

## Brand

- Spalvos: tamsus fonas (#0a0706), varinis akcentas (#C97D3A)
- Šriftai: Playfair Display (display) + Inter (body), iš Google Fonts (jau įjungti CDN)
- Responsive: 380px / 768px / 1024px+ pločiams, hamburger nav < 900px

## Kontaktai dėl klausimų

Darjus — `info@ritmo.lt`, +370 655 19192

---

**Sėkmės! Jei kažko neaišku — visas Claude pokalbio kontekstas su detaliais sprendimais yra pas Darjų, jis gali pasidalinti per Claude Team.**
