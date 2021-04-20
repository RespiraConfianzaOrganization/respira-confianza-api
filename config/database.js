module.exports = {
  "development": {
    "username": "respiraconfianza",
    "password": "respiraconfianza",
    "database": "respiraconfianza",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "logging": false
  },
  "test": {
    "username": "respiraconfianza",
    "password": "respiraconfianza",
    "database": "respiraconfianza",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "logging": false
  },
  "production": {
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "host": "127.0.0.1",
    "dialect": "postgres",
    "logging": false
  }
}