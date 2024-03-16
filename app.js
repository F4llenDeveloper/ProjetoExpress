const express = require("express");
const app = express();
const { engine } = require("express-handlebars")
const bodyParser = require("body-parser")

require("./models/db.js");
const Post = require("./models/Post.js")

// Configurações
// --- Template Engine
// app.engine('handlebars', engine());
app.engine('handlebars', engine({
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}))
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const allPosts = Post.findAll({ order: [["id", "DESC"]] }).then(function (posts) {
    console.log(posts)
    res.render("home", { posts: posts })
  });
});

app.get("/cad", (req, res) => {
  res.render("formulario")
});

app.post("/add", async(req, res) => {
  const { titulo, conteudo } = req.body;
  const post = await Post.create({ titulo, conteudo })
    .then(
      () => res.redirect("/")
      // res.send(`Postagem criada na base de dados! - Título: ${titulo} - Conteúdo: ${conteudo}`)
    )
    .catch(
      (err) => res.send("Erro retornado: " + err)
    );
})

app.get("/deletar/:id", (req, res) => {
  Post.destroy({ where: { "id": req.params.id } }).then(
    () => {
      res.send("Postagem deletada!") 
      // setTimeout(() => res.redirect("/"), 5000)
    }
  )
  .catch(
    (err) => {
      res.send("Essa postagem não existe.") 
      // setTimeout(() => res.redirect("/"), 5000)
    }
  );
});

app.get("/edit/:id", async(req, res) => {
  const post = await Post.findOne({ where: { id: req.params.id } })
  if(!post) return res.send("Postagem não encontrada.")

  res.render("edit", { post });
});

app.post("/edit/:id", async(req, res) => {
  const post = await Post.findOne({ where: { id: req.params.id } })
  if(!post) return res.send("Postagem não encontrada.")

  const { titulo, conteudo } = req.body;
  if(titulo) post.titulo = titulo;
  if(conteudo) post.conteudo = conteudo;

  await post.save({ fields: ['titulo'] });
  await post.reload();

  res.redirect("/")
});

app.listen(3000, () => {
  console.log("Servidor iniciado!")
})