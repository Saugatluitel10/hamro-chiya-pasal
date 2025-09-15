# Hamro Chiya Pasal — Deployment & Ops Guide

This guide covers local development, environment variables, deployment to Render (API) and Vercel (Frontend), contact email setup, and common troubleshooting.

## Live URLs
- Frontend (Vercel): https://frontend-juu3h5fhp-saugats-projects-64133a90.vercel.app
- Backend (Render): https://hamro-chiya-pasal.onrender.com

Health endpoints:
- GET / → { status: 'ok', service: 'hamro-chiya-pasal-api' }
- GET /api/health → { status: 'ok', timestamp }

Menu endpoint:
- GET /api/menu → { categories: [...] }

## Tech Stack
- Frontend: React 18 (TypeScript), Vite, Tailwind CSS, Framer Motion, React Router
- Backend: Node.js (Express), MongoDB (via Mongoose), JWT (planned), Nodemailer

## Local Development
### 1) Backend (Express)
```bash
cd backend
cp .env.example .env   # fill values as needed
npm install
npm run dev            # starts at http://localhost:5000
```
Notes:
- If MONGODB_URI is not set, the server will start without DB (development-friendly).
- CORS defaults allow http://localhost:5173.

### 2) Frontend (Vite)
```bash
cd frontend
cp .env.example .env   # set VITE_API_BASE_URL=http://localhost:5000
npm install
npm run dev            # starts at http://localhost:5173
```

## Environment Variables
### Backend (.env)
- PORT: Default 5000
- CORS_ORIGIN: Comma-separated allowed origins (e.g., http://localhost:5173,https://<your-vercel-url>)
- MONGODB_URI: MongoDB connection string (optional for now)
- JWT_SECRET: Secret for JWT (future use)
- SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS: SMTP credentials for email sending
- SMTP_SECURE: true|false for TLS
- MAIL_FROM: Default From address (optional, default no-reply@hamro-chiya-pasal.local)
- MAIL_TO: Override destination address (optional; if empty, uses SMTP_USER)

Dev fallback: If SMTP_* are not set, emails are not sent; instead a JSON representation is printed to the server console.

### Frontend (.env)
- VITE_API_BASE_URL: API base, e.g. http://localhost:5000 (dev) or your Render URL (prod)

## Deployments
### Backend — Render Web Service
1. Create a Web Service from the GitHub repository
2. Root Directory: backend
3. Build Command: npm install (no build step needed)
4. Start Command: npm start
5. Runtime: Node 20
6. Environment Variables:
   - PORT: 10000 (Render auto-assigns; usually leave it blank so Render manages)
   - CORS_ORIGIN: include your Vercel production URL
   - SMTP_* vars if you want real email delivery; otherwise dev fallback is used
   - MONGODB_URI (optional)
7. Redeploy and verify health endpoints

### Frontend — Vercel Project
1. Import the GitHub repo into Vercel
2. Root Directory: frontend
3. Build Command: npm run build
4. Output Directory: dist
5. Environment Variables:
   - VITE_API_BASE_URL=https://hamro-chiya-pasal.onrender.com
6. Deploy and verify the app opens

## Contact Email Endpoint
- Path: POST /api/contact
- Request JSON:
```json
{
  "name": "Ram",
  "email": "ram@example.com",   // optional if phone provided
  "phone": "+977-9800000000",   // optional if email provided
  "messageType": "inquiry|feedback|catering",
  "preferredContact": "email|phone|whatsapp",
  "message": "Your message",      // optional
  "hp": ""                        // honeypot field, must be empty
}
```
- Response: { ok: true, message: "..." } on success
- Validation: Requires name and at least one of email or phone
- Delivery: Uses SMTP_* credentials if provided; otherwise logs JSON to server console (dev mode)
 - Anti-spam: Honeypot field (hp) is silently accepted if filled; rate limit of 5 requests/min per IP

## Menu API
- Path: GET /api/menu
- Response JSON: `{ "categories": Category[] }`
- Backing store: If MONGODB_URI is set, data is read from the Category collection and seeded once if empty. If MONGODB_URI is not set, a built-in seed is returned.
- Frontend: `Menu.tsx` fetches categories from the API using `VITE_API_BASE_URL` and shows loading/error states with a local fallback.

## Maps & Location
- The Google Maps embed is configured in `frontend/src/pages/Contact.tsx`.
- Update the `src` attribute to point to your exact address if needed.
- Other details (landmarks, access, hours) are simple text blocks in the same file.

## Content Management
- Home page: `frontend/src/pages/Home.tsx`
- Menu and tea cards: `frontend/src/pages/Menu.tsx` and `frontend/src/components/TeaCard.tsx`
- About page (story, sourcing, team): `frontend/src/pages/About.tsx`
- Contact page (location, hours, form): `frontend/src/pages/Contact.tsx`

## Internationalization (NE/EN)
- Provider: `frontend/src/i18n/I18nProvider.tsx`
- Messages: `frontend/src/i18n/messages/ne.json`, `frontend/src/i18n/messages/en.json`
- App wrapper: `I18nProvider` is mounted in `src/main.tsx`
- Toggle: Language switcher in `Navbar` (NE/EN). Selected locale persists in `localStorage`. Default is Nepali unless the browser prefers English.

Tips:
- TeaCard props support Nepali/English names, price, ingredients, health benefits, difficulty, and seasonal badge.
- The About page includes region tabs (Ilam, Dhankuta, Kaski) and a team section; customize arrays as needed.

## Next Steps
- Connect MongoDB and move tea/menu content to collections
- Add authentication + admin area
- Integrate a real SMTP provider (e.g. SendGrid, Mailgun, Gmail SMTP)
- Add tests and CI
- Configure custom domain on Vercel and Render

## Troubleshooting
- CORS errors: Ensure CORS_ORIGIN on backend includes the exact frontend URL (including protocol). Multiple origins can be comma-separated.
- Contact form not sending: If SMTP_* unset, check server logs for JSON output; when using SMTP, verify credentials and allowed sender/recipient.
- 404s: Backend exposes /, /api, and /api/health; contact endpoint at /api/contact.
