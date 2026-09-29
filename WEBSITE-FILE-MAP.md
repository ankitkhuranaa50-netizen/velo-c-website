# Velo C Website — File Map / Cheat Sheet

Jo bhi change karna ho, table mein apna kaam dhundo → wahi file kholo Acode mein.
Har change ke baad hamesha: `git add .` → `git commit -m "kya kiya"` → `git push`

---

## 🏠 Home Page (jo pehli baar khulta hai)

| Kya change karna hai | File | Extra note |
|---|---|---|
| Poora home page ka structure/layout | `artifacts/velo-c/src/App.tsx` | Sabse important file — home page ka 90% content isi mein hai |
| Hero section (top wale 2 characters, heading, "Explore More" button) | `App.tsx` → `SECTION 1+2+3 — HERO` comment ke neeche | ~line 433 |
| Social icons (Telegram, YouTube) | `App.tsx` → `SECTION 4 — SOCIAL ICONS` | ~line 494 |
| **4 category cards** (Editing Tools, Games & Mods, Video Resources, Premium Packs) | `App.tsx` → `SECTION 5 — CATEGORY CARDS` | ~line 514-525. Naya card add karne ke liye isi pattern mein ek line badha do |
| "About Me" section | `App.tsx` → `SECTION 5.5 — ABOUT ME` | ~line 527 |
| Advertisement box | `App.tsx` → `SECTION 5.7 — ADVERTISEMENT BOX` | ~line 637 |
| "Trusted Companies" marquee (scrolling logos) | `App.tsx` → `SECTION 6 — TRUSTED COMPANIES MARQUEE` | ~line 687 |
| Website ka title/description (browser tab, Google search preview) | `artifacts/velo-c/index.html` | `<title>` aur `<meta description>` tags |
| Colors, fonts, spacing, poori styling | `artifacts/velo-c/src/index.css` | Bahut badi file (1400 lines), Ctrl+F se class name search karo |
| Favicon / site icon | `artifacts/velo-c/public/favicon.svg` | Naya icon isi naam se replace karo |

---

## 🔍 "Explore More" Page (jab button dabate ho)

Ye sab bhi **`App.tsx`** file mein hi hai, function `ExploreMoreContent()` (line ~909) ke andar:

| Kya change karna hai | Kahan (App.tsx ke andar) |
|---|---|
| Top slider | `1. Slider` comment ke neeche (~line 988) |
| 2 category buttons (Movies & Web Series / AI Apps) | `2. Category buttons` (~line 1048) |
| "30 Hacks" section aur unlock button (₹19) | `3. Hacks` (~line 1070) |
| Blog/news style articles (3 cards) | `4. Long-form updates and news` (~line 1100) |
| Footer + "Add suggestion" button | `5. Explore footer` (~line 1172) |
| **"Movies & Web Series Apps" list** (items add/remove) | Search `items={['Movie App 01` → edit array (~line 1200) |
| **"AI All Apps & Tools" list** (items add/remove) | Search `items={['AI Tool 01` → edit array (~line 1207) |
| "Redeem Code" popup content | Search `modal === 'redeem'` (~line 1184) |
| "Pro Config" popup content | Search `modal === 'config'` (~line 1190) |
| "Unlock All 30 Hacks" payment popup (UPI/QR) | Search `modal === 'payment'` (~line 1210) |
| "Suggest an Addition" form | Search `modal === 'suggestion'` (~line 1220) |

---

## 🤖 Chatbot (Velo AI)

| Kya change karna hai | File |
|---|---|
| Bot ki personality/tone/kya jawab de | `artifacts/velo-c/api/chat.js` ⚠️ **Ye wali live site use karti hai** |
| (Backup/reference copy — isko bhi same edit karo) | `artifacts/api-server/src/routes/chat.ts` |
| AI model badalna (abhi `gpt-4o-mini` hai) | Dono files mein `model:` wali line |

---

## 🔐 Login / Authentication

| Kya change karna hai | File |
|---|---|
| Firebase config (API key, project ID) | `artifacts/velo-c/src/lib/firebase.ts` |
| Login/logout ka logic | `artifacts/velo-c/src/hooks/useAuth.ts` |
| Login button dikhna/chhupna, profile menu | `App.tsx` mein `useAuth` use hone waali jagah |

---

## ⚙️ Project Config (kam hi chhedni padegi)

| File | Kaam |
|---|---|
| `package.json` (root) | Project-wide settings |
| `artifacts/velo-c/package.json` | Website ki dependencies (jaise firebase, openai) |
| `artifacts/velo-c/vite.config.ts` | Build settings, PORT/BASE_PATH |
| `artifacts/velo-c/tsconfig.json` | TypeScript settings |
| `.gitignore` | Kaunsi files git mein nahi jaani chahiye |

---

## 🗄️ Database (abhi khaali/unused hai)

| File | Kaam |
|---|---|
| `lib/db/src/schema/index.ts` | Yahan naye database tables define hote hain |
| `lib/db/drizzle.config.ts` | Database connection settings |

---

## 📌 Quick memory trick

- **"Website pe dikhta hai, ya text/button/design hai"** → `App.tsx` ya `index.css`
- **"Chatbot se related"** → `api/chat.js`
- **"Login se related"** → `firebase.ts` ya `useAuth.ts`
- **"Naya package/library install karna hai"** → `package.json`

Confuse ho to bas mujhe pooch lena — file ka naam aur exact line number bata dunga.
