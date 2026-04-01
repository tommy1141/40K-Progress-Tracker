# Travel Log App

Following CJ's long tutorial video on [YouTube](https://www.youtube.com/watch?v=DK93dqmJJYg)

## Setup

Make sure to install dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview

```

## Database stuff

### Local Development

install the [Turso CLI](https://docs.turso.tech/quickstart)

```bash
turso dev --db-file local.db
```

### Windows

need to run the command in WSL in the root folder of this project

## commands

### Start Dev

1. cd into `/mnt/c/Dve/40K-Progress-Tracker`
2. run `turso dev --db-file ./local.db`
3. run `pnpm dbs`
4. run `pnpm dev`

### rebuild the database

1. stop server and turso server
2. delete local.db files.
3. run `pnpm drizzle-kit generate`
4. run `pnpm dev:db`
5. open new terminal and run `pnpm drizzle-kit migrate`
6. run `pnpm dev`
