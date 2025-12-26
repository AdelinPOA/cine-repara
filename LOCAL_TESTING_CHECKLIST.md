# 📋 Local Testing Checklist

## Setup Verificat
- [ ] Dependencies instalate (`npm install`)
- [ ] `.env.local` configurat cu database credentials
- [ ] Migrații rulate (`npm run db:migrate`)
- [ ] Dev server pornit (`npm run dev`)

## 1. Homepage (/)

**URL**: http://localhost:3000

- [ ] Homepage se încarcă corect
- [ ] Se vede titlul "Cine Repara"
- [ ] Butoanele "Găsește Instalatori" și "Înregistrare Instalator" sunt vizibile
- [ ] Footer-ul se afișează

## 2. Autentificare

### Login (/login)

**URL**: http://localhost:3000/login

- [ ] Pagina de login se încarcă
- [ ] Formular cu email și password
- [ ] Link către "Înregistrare"
- [ ] Validare formulare (erori pentru email invalid, etc.)

### Register Customer (/register/customer)

**URL**: http://localhost:3000/register/customer

- [ ] Pagina de înregistrare client se încarcă
- [ ] Formular complet (nume, email, password, confirm password, telefon)
- [ ] Validare parole (minim uppercase, lowercase, cifră)
- [ ] Validare email format
- [ ] Validare telefon românesc
- [ ] Link către Login

**Test Account Creation**:
```
Nume: Test Customer
Email: test@example.com
Password: TestPassword123
Confirm: TestPassword123
Phone: 0712345678
```

### Register Installer (/register/installer)

**URL**: http://localhost:3000/register/installer

- [ ] Pagina de înregistrare instalator se încarcă
- [ ] Similar cu customer registration
- [ ] Role = installer

**Test Account**:
```
Nume: Test Installer
Email: installer@example.com
Password: InstallerPass123
Confirm: InstallerPass123
Phone: 0723456789
```

## 3. Dashboard Customer

**URL**: http://localhost:3000/dashboard/customer

**Prerequisites**: Trebuie să fii autentificat ca client

- [ ] Dashboard se încarcă după login
- [ ] Mesaj de bun venit cu numele userului
- [ ] Secțiuni vizibile (găsește instalatori, recenzii)
- [ ] Link către logout

## 4. Dashboard Installer

**URL**: http://localhost:3000/dashboard/installer

**Prerequisites**: Trebuie să fii autentificat ca instalator

- [ ] Dashboard se încarcă
- [ ] Alert pentru completare profil (dacă e nou cont)
- [ ] Link către "Completează Profilul"
- [ ] Statistici (recenzii, rating) - 0 pentru cont nou

## 5. Completare Profil Instalator

**URL**: http://localhost:3000/dashboard/installer/profile

**Prerequisites**: Autentificat ca instalator

### Step 1: Business Information
- [ ] Form se încarcă
- [ ] Câmpuri: Business Name, Bio, Years Experience, Hourly Rate
- [ ] Buton "Următorul Pas"

**Test Data**:
```
Business Name: Instalații Termo SRL
Bio: Specialist în instalații termice cu 10 ani experiență
Years: 10
Hourly Rate: 150-200 RON
```

### Step 2: Services
- [ ] Lista de categorii servicii se încarcă din database
- [ ] Checkbox-uri pentru categorii principale
- [ ] Subcategorii se expandează
- [ ] Cel puțin 1 serviciu obligatoriu

**Select**:
- [ ] Instalații Termice
- [ ] Instalații Sanitare

### Step 3: Service Areas
- [ ] Dropdown regiuni se încarcă
- [ ] După selectare regiune, orașe se încarcă
- [ ] Poți adăuga multiple orașe
- [ ] Cel puțin 1 oraș obligatoriu

**Select**:
- [ ] Regiunea: București
- [ ] Oraș: Sector 1, Sector 2

### Step 4: Review & Submit
- [ ] Summary complet (business info, servicii, orașe)
- [ ] Checkbox "Sunt de acord"
- [ ] Buton "Publică Profil"
- [ ] După submit: redirect la dashboard
- [ ] Profile status: COMPLETED

## 6. Browse Instalatori

**URL**: http://localhost:3000/instalatori

- [ ] Pagina se încarcă
- [ ] Search bar vizibil
- [ ] Filter panel (stânga)
- [ ] Lista instalatori (gol dacă nu există)
- [ ] Pagination

**După ce ai creat instalator cu profil complet**:
- [ ] Instalatorul apare în listă
- [ ] Card arată: nume, rating, experiență, servicii
- [ ] Click pe card → profil instalator

## 7. Profil Public Instalator

**URL**: http://localhost:3000/instalatori/[slug]

**Prerequisites**: Cel puțin 1 instalator cu profil complet

- [ ] Profil se încarcă
- [ ] Header cu nume, rating, experiență
- [ ] Badge-uri servicii
- [ ] Listă orașe deservite
- [ ] Tarifuri
- [ ] Secțiune Contact (telefon, email)
- [ ] Secțiune Recenzii (gol inițial)
- [ ] Form pentru adăugare recenzie (dacă ești client autentificat)

## 8. Adăugare Recenzie

**Prerequisites**:
- Autentificat ca CLIENT
- Pe pagina unui instalator

- [ ] Form recenzie vizibil
- [ ] Selectare rating (1-5 stele)
- [ ] Titlu recenzie (obligatoriu)
- [ ] Comentariu (obligatoriu)
- [ ] Serviciu (dropdown)
- [ ] Data finalizare lucrare (opțional)
- [ ] Buton "Trimite Recenzia"

**Test Review**:
```
Rating: 5 stele
Titlu: Lucrare excelentă
Comentariu: Foarte profesionist, a terminat la timp.
Serviciu: Instalații Termice
Data: 2024-12-01
```

**După submit**:
- [ ] Toast success message
- [ ] Recenzie apare în listă
- [ ] Rating instalator se actualizează
- [ ] Nu mai poți adăuga altă recenzie (verifică mesaj)

## 9. Servicii by Category

**URL**: http://localhost:3000/servicii/instalatii-termice

- [ ] Pagina se încarcă
- [ ] Breadcrumb corect
- [ ] Filtre disponibile
- [ ] Lista instalatori pentru acel serviciu
- [ ] Sortare (rating, preț, experiență)

## 10. Search & Filters

### Search Bar
- [ ] Caută "instalator" → rezultate
- [ ] Caută "București" → rezultate filtrate
- [ ] Caută "termo" → instalatori cu acel serviciu

### Filters
- [ ] Filter by region → listă se actualizează
- [ ] Filter by city → listă se actualizează
- [ ] Filter by rating (min 4 stele)
- [ ] Filter by price max
- [ ] Filter by availability
- [ ] Combină multiple filtre

## 11. Error Pages

### 404 Not Found
**URL**: http://localhost:3000/pagina-inexistenta

- [ ] Pagina 404 custom se încarcă
- [ ] Mesaj "404 - Pagina nu a fost găsită"
- [ ] Link înapoi acasă
- [ ] Helpful links (Servicii, Instalatori)

### 500 Error
**Trigger**: Eroare server (ex: database down)

- [ ] Pagina error custom se încarcă
- [ ] Mesaj prietenos
- [ ] Buton "Încearcă din nou"

## 12. Responsive Design

**Test pe diferite dimensiuni**:

- [ ] Mobile (< 640px)
  - [ ] Meniu hamburger
  - [ ] Cards stack vertical
  - [ ] Forms responsive

- [ ] Tablet (640px - 1024px)
  - [ ] Layout se ajustează
  - [ ] Sidebar collapse-able

- [ ] Desktop (> 1024px)
  - [ ] Layout complet
  - [ ] Toate feature-urile vizibile

## 13. SEO & Meta

### Homepage
- [ ] Title: "Cine Repara - Găsește instalatori..."
- [ ] Meta description populat
- [ ] Open Graph tags (view source)

### Installer Profile
- [ ] Title: "[Nume Instalator] - Instalator [Oraș]"
- [ ] Meta description cu bio
- [ ] Open Graph cu detalii

### Sitemap
**URL**: http://localhost:3000/sitemap.xml

- [ ] Sitemap se generează
- [ ] Include homepage
- [ ] Include installer profiles (dacă există)
- [ ] Include service pages

### Robots.txt
**URL**: http://localhost:3000/robots.txt

- [ ] Robots.txt se servește
- [ ] Allow: /
- [ ] Disallow: /api/, /dashboard/
- [ ] Sitemap link corect

## 14. Performance

### Lighthouse Audit
- [ ] Run Lighthouse in Chrome DevTools
- [ ] Performance: > 70
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 90

### Network
- [ ] Check Network tab
- [ ] No console errors
- [ ] API calls reasonable
- [ ] Images optimized

## 15. Romanian Formatting

### Verifică formatări:
- [ ] Date: "26 decembrie 2024" (nu "December 26")
- [ ] Monedă: "150,00 RON" (nu "$150")
- [ ] Telefon: "0712 345 678" (cu spații)
- [ ] Plurale: "5 recenzii", "1 recenzie" (corect)
- [ ] Time ago: "acum 2 ore", "ieri" (în română)

## 16. Tests

```bash
# Run all tests
npm test -- --run

# Should see:
# ✓ 69 tests passing
# ✓ Button component (15)
# ✓ Auth validation (17)
# ✓ Format utilities (37)

# Coverage
npm run test:coverage

# Should generate HTML report in coverage/
```

- [ ] Toate testele trec (69/69)
- [ ] Coverage report se generează
- [ ] No failing tests

## Common Issues & Solutions

### Issue: "Connection refused" la database
**Solution**:
- Verifică `.env.local` are credențiale corecte
- Verifică database este pornit (Vercel Postgres sau local PostgreSQL)
- Test connection: `npm run db:migrate`

### Issue: "Module not found"
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"
**Solution**:
```bash
# Linux/macOS
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Or use different port
PORT=3001 npm run dev
```

### Issue: Migrații eșuează
**Solution**:
- Verifică database connection string
- Drop și recrează database-ul dacă e nevoie
- Rulează migrațiile manual din fișierele SQL

### Issue: NextAuth errors
**Solution**:
- Verifică `NEXTAUTH_SECRET` este setat în `.env.local`
- Generează nou: `openssl rand -base64 32`
- Verifică `NEXTAUTH_URL` = "http://localhost:3000"

## ✅ Success Criteria

Ai testat cu succes când:
- [ ] Poți crea conturi (client și instalator)
- [ ] Instalatorul poate completa profil (4 steps)
- [ ] Profilul apare în browse instalatori
- [ ] Clientul poate lăsa recenzie
- [ ] Search și filters funcționează
- [ ] Toate paginile se încarcă fără erori
- [ ] Responsive pe toate dimensiunile
- [ ] Tests passing (69/69)

---

**🎉 Congratulations!** Dacă ai bifat toate, aplicația funcționează perfect local!

**Next Steps**: Deploy pe Vercel pentru production testing.
