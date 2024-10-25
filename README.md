# Node React Boilerplate

Express and react setup with typescript and vite. This is a boilerplate to get projects started.

## How to run the project

- Install dependencies by running `npm install` in the project root.
- Navigate to the server/ directory, copy the `.env.example` to `.env` and fill in missing fields.
- Next run `npx prisma generate` to regenerate prisma db client code.
- Then `npx prisma migrate deploy` to generate a local sqlite db and apply migrations.
- Now navigate back to the project root and `npm run dev` will spin up the app in development mode.
- Go to localhost:3007 in your browser to see the app. By default in dev mode the client will run on port 3007 and the server on port 3006.

## Migrations

- https://www.prisma.io/docs/orm/reference/prisma-cli-reference#prisma-migrate
- Update the schema file with the desired changes.
- Navigate to the server directory and run `npx prisma migrate dev --create-only --name migrationNameHere` to generate the migration file.
  The create-only flag prevents it from being immediately applied.
