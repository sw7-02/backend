# backend
## Install
```bash
npx tsc --init
npm install
```
## Run
```bash
npm start
```
### Test
```bash
npm test
```

## Update Prisma
run
```bash
npx prisma generate
```
to get the new models

## Database
Load the schema.sql file into a database and run it.

Create .env file in root of repository and add connection string:
```
DATABASE_URL="postgresql://username:password@host:port/database_name"
```
To create mock data run:
```
npx prisma db seed
``` 
