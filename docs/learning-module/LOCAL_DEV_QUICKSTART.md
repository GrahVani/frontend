# Grahvani Learning Module — Local Dev Quickstart

> Clone-to-running-app instructions for a developer about to work on the learning module specifically. Estimated time: **45 minutes** from `git clone` to "submitted my first MCQ".

**Doc owner:** Goutham Kadumuru.
**Version:** 1.0 — 2026-05-22 (LOCKED).

---

## 0. TL;DR — The shortest path

```bash
# Once
git clone <repo> Grahvani && cd Grahvani
cd backend && docker compose up -d postgres redis
cd services/learning-service && npm install && npx prisma generate && npx prisma db push
JWT_SECRET="cd240d9031f96046b4f42411d59ea3edc90a35a769ae4096042449b5508ad8ce" NODE_ENV=development npm run db:seed

# Every dev session
cd ../../  # → backend
docker start grahvani-pg grahvani-redis
cd services/learning-service && JWT_SECRET="..." npm run dev &
cd ../../../frontend && npm run dev &

# In browser
# 1. Open http://localhost:3000
# 2. Paste the dev-JWT snippet (see §3) into the browser console
# 3. Navigate to /learn/tier-1/module-1/chapter-1/lesson-1
```

That's it. Read the rest of this doc if any step fails.

---

## 1. Prerequisites

Install BEFORE doing anything else:

| Tool | Version | Install via |
|---|---|---|
| Node.js | 22 LTS | nvm: `nvm install 22 && nvm use 22` |
| npm | 10+ | bundled with Node 22 |
| Docker Desktop | latest | https://docker.com |
| Git | any recent | OS package manager |
| `psql` (optional, recommended) | 16 | OS package manager OR `brew install postgresql@16` |
| GitHub CLI `gh` (optional) | latest | `brew install gh` |

Verify:

```bash
node --version    # → v22.x
docker ps          # → no errors (Docker daemon running)
```

---

## 2. First-time bootstrap (~30 minutes)

### 2.1 Clone the monorepo

```bash
cd ~/your-projects
git clone <repo-url> Grahvani
cd Grahvani
```

Repo layout:

```
Grahvani/
├── frontend/          ← Next.js 16 app (port 3000)
├── backend/           ← microservices monorepo (Express services)
├── curriculum/        ← markdown lesson source-of-truth
├── docs/              ← platform-wide system docs
└── README.md
```

### 2.2 Start Postgres + Redis

```bash
cd backend
docker compose up -d postgres redis

# Wait for them to be ready
sleep 5
docker ps --filter 'name=grahvani' --format 'table {{.Names}}\t{{.Status}}'
# Should show:
#   grahvani-pg     Up X seconds
#   grahvani-redis  Up X seconds
```

If postgres fails to come up:

```bash
docker logs grahvani-pg
# Inspect for permission / volume issues
```

### 2.3 Install backend dependencies + apply schema

```bash
cd services/learning-service
npm install
npx prisma generate
npx prisma db push   # creates 21 tables in `grahvani` database
```

Verify the schema landed:

```bash
docker exec grahvani-pg psql -U grahvani -d grahvani -c '\dt'
# Should list 21+ tables including Lesson, LessonProgress, BadgeDefinition, etc.
```

### 2.4 Seed the curriculum

```bash
JWT_SECRET="cd240d9031f96046b4f42411d59ea3edc90a35a769ae4096042449b5508ad8ce" \
  NODE_ENV=development \
  npm run db:seed
```

Expected output (last lines):

```
✅ Curriculum seeded:
   📚 48 modules
   📂 147 chapters
   📝 598 lessons
🏅 Default badges seeded
```

If you see "FATAL: tenant not found" or similar, your `DATABASE_URL` may still point at Supabase — verify `services/learning-service/.env`:

```bash
cat services/learning-service/.env
# Should contain:
#   DATABASE_URL=postgres://grahvani:grahvani2026prod@localhost:5432/grahvani
#   DIRECT_URL=postgres://grahvani:grahvani2026prod@localhost:5432/grahvani
#   PORT=3013
```

### 2.5 Boot the learning-service

```bash
# Still inside services/learning-service
JWT_SECRET="cd240d9031f96046b4f42411d59ea3edc90a35a769ae4096042449b5508ad8ce" \
  NODE_ENV=development \
  npm run dev
```

Expected output:

```
[XX:XX:XX] INFO: 🎓 Learning Service running on port 3013
[XX:XX:XX] INFO:    - API: /api/v1/learn/*
[XX:XX:XX] INFO: Connected to database
```

Verify health:

```bash
curl -sS http://localhost:3013/health
# → {"status":"ok","service":"learning-service",...}
```

**Leave this terminal running.** Open a new terminal for the next step.

### 2.6 Install + boot the frontend

```bash
cd ../../../frontend
npm install
```

Configure env (one-time):

```bash
cat > .env.local <<'EOF'
NEXT_PUBLIC_LEARNING_SERVICE_URL=http://localhost:3013/api/v1
EOF
```

Boot:

```bash
npm run dev
```

Expected output:

```
▲ Next.js 16.1.1 (Turbopack)
- Local:   http://localhost:3000
✓ Ready in ~1s
```

---

## 3. Forge a dev JWT and inject it

The learning-service expects JWTs signed with the canonical secret. We don't have a real auth-service running locally (the production auth-service backs onto Supabase which is unreachable as of 2026-05-22). So we forge a dev token:

### 3.1 Forge

```bash
node -e "
const jwt = require('jsonwebtoken');
const t = jwt.sign(
  { userId: 'dev-local-user', sub: 'dev-local-user', email: 'dev@local', role: 'learner' },
  'cd240d9031f96046b4f42411d59ea3edc90a35a769ae4096042449b5508ad8ce',
  { expiresIn: '30d' }
);
console.log(t);
" > /tmp/dev.jwt

cat /tmp/dev.jwt
```

You'll get a long JWT string. Copy it.

### 3.2 Inject into the browser

Open `http://localhost:3000` in the browser. Open devtools console (right-click → Inspect → Console). Paste:

```javascript
localStorage.setItem('accessToken',  '<paste-your-JWT>');
localStorage.setItem('refreshToken', '<paste-same-JWT>');
location.href = '/learn';
```

The page reloads at `/learn` and the GamificationPanel hydrates with real backend data ("Tier 1 · Jyotish Novice", "0 XP earned", "5 upcoming badges", etc.).

### 3.3 Verify the round-trip

Open devtools Network tab → reload `/learn`. You should see:

| Request | Status |
|---|---|
| `GET /api/v1/learn/dashboard?userId=dev-local-user` | 200 |
| `POST /api/v1/learn/gamification/daily/login/dev-local-user` | 200 |

If you see 401: your JWT is malformed or signed with a different secret. Re-forge.

---

## 4. Take Lesson 1 end-to-end

1. Navigate to `http://localhost:3000/learn/tier-1/module-1/chapter-1/lesson-1`
2. Scroll through §1 → §12. You should see:
   - §1 Cold Open with DropCap
   - §2/§3 Scholar's Contract (twin cards)
   - §4 Concept Theatre with the Vedic Body Map figure + Vedāṅga↔Vedānta Comparator
   - §5 Sloka Block with trilingual rendering of Pāṇinīya Śikṣā 41-42
   - §6 Worked Example
   - §7 Primary Simulator
   - §8 Mistake Card Deck
   - §9 Memory Anchor Deck
   - §10 MCQ Flow — click "Begin the quiz"
   - §11 Summary with "Anchored In" footer
   - §12 Continuation linking to lesson-2
3. Pass the MCQ (≥80%) and watch the lesson flip to "Mastered"
4. Navigate back to `/learn`. The lotus on lesson 1 should now be open with a checkmark.

If anything in the above flow fails, see [`backend/services/learning-service/README.md`](../../../backend/services/learning-service/README.md) §13 "Common failures + recovery".

---

## 5. Every-session workflow

After the first-time bootstrap, your typical session:

```bash
# Terminal 1: backend
cd Grahvani/backend
docker start grahvani-pg grahvani-redis
cd services/learning-service
JWT_SECRET="cd240d9031f96046b4f42411d59ea3edc90a35a769ae4096042449b5508ad8ce" npm run dev

# Terminal 2: frontend
cd Grahvani/frontend
npm run dev
```

Open `http://localhost:3000`, JWT already in localStorage from last session (still valid 30 days).

---

## 6. Common workflows

### 6.1 You changed lesson markdown — see it in the dashboard

```bash
cd backend/services/learning-service
JWT_SECRET="..." npm run db:seed
# Frontend hot-reloads — markdown body changes are visible immediately
# DB-backed views (mastery tree) refresh on next request
```

### 6.2 You changed Prisma schema — apply it

```bash
cd backend/services/learning-service
npx prisma generate
npx prisma db push   # dev only; in prod use prisma migrate
# Restart the service so the new client is loaded
```

### 6.3 You added a new chrome component — verify

```bash
cd frontend
npx tsc --noEmit
# Then hard-reload the browser to confirm visual
```

### 6.4 You wrote a new lesson — validate before committing

```bash
cd backend/services/learning-service
JWT_SECRET="..." npm run import-lesson -- \
  ../../../curriculum/tier-1-foundation/module-XX-xxx/chapter-YY-yyy/lesson-ZZ-zzz.md --dry-run
```

If clean, commit the markdown. Run the same command without `--dry-run` (or `npm run db:seed`) to import.

### 6.5 You need to reset your local DB to a clean state

```bash
cd backend/services/learning-service
JWT_SECRET="..." npm run db:reset-seed
# Destructive. Wipes all per-user state. Re-seeds curriculum.
```

### 6.6 You need to clear your client-side state

```javascript
// In the browser console:
localStorage.clear();
location.href = '/learn';
// Then re-inject the dev JWT per §3
```

---

## 7. Hooking up to your IDE

### 7.1 VS Code

Recommended extensions:

- **ESLint** — Microsoft
- **Prisma** — Prisma
- **Tailwind CSS IntelliSense** — Tailwind Labs
- **Pretty TypeScript Errors** — yoavbls
- **Error Lens** — Alexander
- **GitLens** — GitKraken

Workspace `.vscode/settings.json` to consider:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["className=\\{?\"([^\"]*)\"\\}?", "([^\\s]+)"]
  ]
}
```

### 7.2 IntelliJ / WebStorm

Mark these folders:

- `frontend/.next` — excluded
- `node_modules` (everywhere) — excluded  
- `backend/services/*/dist` — excluded

Enable: TypeScript service for the workspace.

---

## 8. Debug snippets

### 8.1 Check what's in your localStorage progress store

```javascript
// In the browser console:
JSON.parse(localStorage.getItem('grahvani-learning-progress'))
```

### 8.2 Inspect the mutation queue

```javascript
JSON.parse(localStorage.getItem('grahvani-learning-mutation-queue') || '[]')
```

### 8.3 Clear cooldown for a specific lesson

```sql
-- In psql against grahvani database
UPDATE "LessonProgress"
SET status = 'IN_PROGRESS'
WHERE "userId" = 'dev-local-user'
  AND "lessonId" = (SELECT id FROM "Lesson" WHERE slug = 'jyotisha-as-vedanga');
```

### 8.4 See your gamification profile

```bash
JWT=$(cat /tmp/dev.jwt)
curl -sS -H "Authorization: Bearer $JWT" \
  http://localhost:3013/api/v1/learn/gamification/profile/dev-local-user \
  | python3 -m json.tool
```

### 8.5 List all your earned badges

```bash
curl -sS -H "Authorization: Bearer $JWT" \
  http://localhost:3013/api/v1/learn/gamification/badges/dev-local-user \
  | python3 -m json.tool
```

---

## 9. When things go wrong

| Symptom | Fix |
|---|---|
| Frontend shows "Loading curriculum…" forever | The curriculum/ directory isn't found. Check `frontend/.env.local` and `process.cwd()` location |
| GamificationPanel shows "Server unreachable — local-only mode" | Backend isn't running on :3013 OR `NEXT_PUBLIC_LEARNING_SERVICE_URL` in `.env.local` is wrong. Restart frontend after `.env.local` changes |
| MCQ submission returns 401 | JWT expired or signed with wrong secret. Re-forge per §3 |
| MCQ submission returns 429 | 24-hour cooldown active. See §8.3 to clear OR wait |
| Sticky chrome bar overlapping content | Hard-reload the page (Cmd+Shift+R) — Turbopack CSS cache may be stale |
| Lesson title shows "TIER 1 · MODULE 1" but body is empty | Markdown file exists but `npm run db:seed` hasn't been run since the file was added. Re-seed. |
| Network tab shows lots of 401s | JWT lifetime expired. Re-forge per §3 (30-day expiry is forgiving but eventually triggers) |
| Frontend port :3000 already in use | `lsof -i :3000 -t \| xargs kill -TERM` then `npm run dev` |
| Service port :3013 already in use | Same fix with :3013 |

---

## 10. The full doc map (you're here)

After local-dev quickstart, read in order:

1. [`HANDOFF_PLAYBOOK.md`](./HANDOFF_PLAYBOOK.md) — orientation + map
2. [`00-design-constitution.md`](./00-design-constitution.md) — visual + structural authority
3. [`SEEDING_AND_INGESTION.md`](./SEEDING_AND_INGESTION.md) — markdown ↔ DB flow
4. [`FRONTEND_COOKBOOK.md`](./FRONTEND_COOKBOOK.md) — recipes for extending frontend
5. [`backend/services/learning-service/README.md`](../../../backend/services/learning-service/README.md) — backend runbook
6. [`GAMIFICATION_RULES.md`](./GAMIFICATION_RULES.md) — XP / streak / badges spec
7. [`IMAGES_AND_ASSETS.md`](./IMAGES_AND_ASSETS.md) — image standards
8. [`QA_CHECKLIST.md`](./QA_CHECKLIST.md) — PR review checklist
9. [`curriculum/02-lesson-authoring-standard.md`](../../../curriculum/02-lesson-authoring-standard.md) — lesson markdown schema
10. [`curriculum/05-interactive-component-taxonomy.md`](../../../curriculum/05-interactive-component-taxonomy.md) — interactive families
11. [`curriculum/06-assessment-design-standard.md`](../../../curriculum/06-assessment-design-standard.md) — MCQ design

---

*End of LOCAL_DEV_QUICKSTART v1.0 — 2026-05-22.*
