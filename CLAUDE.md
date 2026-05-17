# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Install all dependencies (root, server, client)
npm run install

# Start dev server with hot reload (runs server on :3001, client on :3002)
npm run develop

# Build client for production
npm run build

# Start production server only
npm start
```

### Server only
```bash
cd server && npm run watch   # nodemon watch mode
cd server && npm run seed    # seed database
```

### Client only
```bash
cd client && npm test        # Jest test runner (interactive)
cd client && npm test -- --watchAll=false   # run tests once
```

### Prerequisites
- MongoDB must be running locally (`mongod`) for development
- Local DB: `mongodb://localhost/psychic_db`
- Production DB: `MONGODB_URI` env var

## Architecture

This is a MERN + GraphQL monorepo:

```
/
├── server/          Express + Apollo Server 3 (port 3001)
└── client/          React 18 CRA app (port 3002, proxies /graphql to :3001)
```

### Server (`server/`)

- **Entry**: `server/server.js` — boots Apollo Server as Express middleware, serves static client build in production
- **GraphQL schema**: `server/schemas/typeDefs.js` (all types/queries/mutations) + `server/schemas/resolvers.js`
- **Models**: `server/models/` — `User` and `Concert` Mongoose models
- **Auth**: JWT-based; `authMiddleware` in `server/utils/auth.js` attaches user to Apollo context on every request
- **Scraper**: `server/utils/scraper.js` scrapes `austinchronicle.com` via axios + cheerio, fetches two pages per date (page 1 and page-2), then follows each event URL for venue details. Results are saved via `addConcert` util
- **Cron**: `server/utils/cron.js` (currently commented out in server.js) — scheduled scraping

### Client (`client/src/`)

- **State**: `GlobalState.js` — React Context (`ConcertContext`) holding `user`, `date` (selected date as midnight UTC ISO string), and `sortOrSearch`. Consumed via `useConcertContext()`
- **Apollo**: configured in `App.js` — JWT token attached to every request from `localStorage.id_token`
- **Routing**: React Router v6; routes: `/`, `/login`, `/signup`, `/profile/:username`, `/show/:artists`, `/venue/:venueName`
- **GraphQL**: all queries in `client/src/utils/queries.js`, all mutations in `client/src/utils/mutations.js`

### Data model notes

- Concert `date` is stored as a midnight UTC ISO string (e.g. `2024-03-15T00:00:00.000Z`). Use `formatConcertDate()` from `client/src/utils/helpers.js` to display it
- Concert `customId` is a deduplication key: `headliner + date + venue` with whitespace/punctuation stripped
- User has Mongoose virtuals: `concertCount`, `friendCount`, `requestCount`, `sentCount`, `receivedCount`, `blockedCount`

## Code style

- Ternary operators: `?` and `:` go at the **end** of lines, not the start
