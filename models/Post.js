const { Sequelize, sequelize } = require("./db.js")

const Post = sequelize.define("postagens", {
    titulo: {
        type: Sequelize.STRING
    },
    conteudo: {
        type: Sequelize.CHAR
    }
});

// Post.sync({ force: true })
module.exports = Post;