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
create .env file in root of repository and add connection string:
```
DATABASE_URL="postgresql://username:password@host:port/database_name"
```
to create mock data run
```
npx prisma db seed
``` 
