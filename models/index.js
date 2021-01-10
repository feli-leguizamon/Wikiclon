const Page = require("./Page")
const User = require("./User")

// me crea en la tabla page, una columna con el userId
Page.belongsTo(User, {as: "author"})

module.exports = {Page, User}