const Sequelize = require("sequelize");
const sequelize = new Sequelize("database_test", "root", "umasenhadahora", {
    host: "localhost",
    dialect: "mysql"
});

sequelize.authenticate()
.then(() => console.log("Conectado com sucesso!"))
.catch(console.error)

module.exports = {
    Sequelize,
    sequelize,
}