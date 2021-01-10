const Sequelize = require("sequelize")

const db = new Sequelize("postgres://localhost:5432/wiki", {
    // saca el console.log de todas las consultas porque cada vez que hagamos una consulta a la db si no hago logging false, esa interaccion me la va a aclarar en la consola y va a ser muy tedioso. 
    logging: false
})

module.exports = db
