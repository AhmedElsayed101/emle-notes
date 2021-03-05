module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "00000000",
  DB: "emle",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  secretKey : "skadfklasd"
};