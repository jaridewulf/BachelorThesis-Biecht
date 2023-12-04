# Backend

### Start
```sh
#start
docker compose up 
# stop
docker compose down
```

### Prisma
When we change anything about the database models:
```sh
npx prisma migrate dev
```

Remove all data from databse
```sh
npx prisma migrate reset
```

To add initial (dummy) data
```sh
npx prisma db seed
```

### PgAdmin
When we connect the database in pgAdmin. We are effectively communicating between 2 containers.
The containers think they are running on different computers. So we can't use localhost or 127.0.0.1.
Instead we need to use the `service name` (see: docker compose). Docker will do the required translations within its network.