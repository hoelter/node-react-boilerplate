# Node React Monorepo Boilerplate

This is boilerplate to hit the ground running with a typescript monorepo that has a completely separated server/client with a react SPA,
with typesafe communication done through TRPC. This is an alternative approach to the SSR and server coupling that is 
encouraged when using remix (react-router v7) or next.js. Packages included are intended to provide high value while limiting
the frameworks or libraries one may need to learn.

What this gives you:
- Node express server and react SPA client communicating over [TRPC](https://trpc.io) with shared [zod](https://zod.dev) validation throughout.
- Queuing and background jobs with [pg-boss](https://github.com/timgit/pg-boss).
- Extremely simple cookie authentication with a protected route pattern in place.
- [Postgres.js](https://github.com/porsager/postgres) for database communication.
- Dockerfile, Procfile, and app.json ready to deploy to a [dokku](https://dokku.com) server or on Heroku.
- [Mantine library](https://mantine.dev) for react -- well documented expansive component library with form helpers.

## Local Setup

- Install [nodejs version 23](https://nodejs.org/en/download).
- Run `corepack enable` to install the [pnpm](https://pnpm.io/installation) package manager.
- Install dependencies by running `pnpm i` in the project root.
- Navigate to the server/ directory, copy the `.env.example` to `.env` and fill in missing fields.
- Setup your local postgres db with the database name you decided to user in your env file, and run the included initial migration.
```bash
psql -d postgres -c "create database node_react_boilerplate"
psql -d node_react_boilerplate < ./server/migrations/1_initial_create.sql
```
- In the project root directory now `pnpm run dev` to spin up the server and client with vite locally.
- Go to localhost:3007 in your browser to see the app. By default in dev mode the client will run on port 3007 and the server on port 3006.
- Login with username "test" password "test".

