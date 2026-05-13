# Ritmas — Pramogų Klubas, svetainė

Statinė HTML/CSS/JS svetainė su 10 puslapių. Sukurta pagal jūsų prekės ženklą — tamsi, premium, kinematografinė paletė su variniu/bronziniu akcentu.

## Failų struktūra

```
ritmas-svetaine/
├── index.html              # Pagrindinis puslapis
├── ritmas.html             # Renginių erdvė (LED šokių aikštelė)
├── uptown.html             # Uptown Billiards
├── offline-games.html      # Offline Games (431 m², su partneriu Offline Game Club)
├── darts-bar.html          # Darts & Billiards Vilnius (Verkių 29)
├── darts-palanga.html      # Darts & Billiards Palanga (Vytauto 64)
├── perkunas.html           # Perkūnas DC (smiginis)
├── vilko-kasnis.html       # Vilko Kąsnis (catering)
├── retrobus.html           # RetroBus (party busas)
├── kontaktai.html          # Kontaktai
└── assets/
    ├── style.css           # Visi stiliai
    └── script.js           # Nav + formos + animacijos
```

## Erdvės ir paslaugos

**8 erdvės pagrindiniame puslapyje (visa kortelė paspaudžiama):**
1. Ritmas — renginių erdvė su LED šokių aikštele
2. Uptown Billiards — premium biliardas
3. Offline Games — 431 m² teambuilding ir stalo žaidimų erdvė (su Offline Game Club)
4. Darts & Billiards Vilnius — Verkių 29 (didžiausias Vilniaus bunkeris)
5. Darts & Billiards Palanga — Vytauto 64
6. Perkūnas DC — smiginio klubas
7. Vilko Kąsnis — catering
8. RetroBus — party busas

**8 paslaugos:** Gyva muzika ir DJ · Pramogos ir žaidimai · Offline žaidimai ir teambuilding · Vilko Kąsnis maitinimas · RetroBus transportas · Vakaro vedėjas ir programa · Pilnas renginio paketas · Lankstūs biudžetai

**10 renginio tipų:** Įmonių renginiai · Kalėdiniai vakarėliai · Gimtadieniai · Vestuvės · Bern- ir mergvakariai · Išleistuvės/studentų šventės · Konferencijos ir pristatymai · Turnyrai · Krikštynos/jubiliejai · Vaikų šventės

## Kaip įdėti į hostingą

1. Atsiųskite visą `outputs/` aplanko turinį į savo serverio root direktoriją (pvz., `public_html/`).
2. Jokio backend'o nereikia — tai statinis svetainės kompletas.
3. `index.html` taps pagrindiniu puslapiu (`ritmas.lt`).

## Brand spalvos (CSS kintamieji)

```css
--bg: #0a0706            (juodas fonas)
--copper: #C97D3A        (varinis akcentas — pagrindinis)
--copper-light: #E29A5C  (švies. varinis hover'ams)
--cream: #F1E4D2         (švies. tekstas)
```

Šriftai: Playfair Display (display) + Inter (body).

## Mobile

Visi puslapiai pilnai responsive — 380px, 768px, 1024px+ pločiuose. Hamburger menu < 900px.

## Naujausi pakeitimai

- ✓ Pokerais paslauga pašalinta visur, vietoje pridėta Offline Games (431 m², Vytenio 42A)
- ✓ Darts Bar → Darts & Billiards Vilnius
- ✓ Darts Palanga → Darts & Billiards Palanga
- ✓ Visa erdvių kortelė paspaudžiama (ne tik „Daugiau →" nuoroda)
- ✓ Paslaugos: 6 → 8 (pridėta Offline žaidimai/teambuilding ir Vakaro vedėjas)
- ✓ Renginiai: 8 → 10 (pridėta Išleistuvės/studentų šventės ir Krikštynos/jubiliejai)

---

**Kontaktas redagavimui:**
+370 655 19192 · ritmo@ritmo.lt
