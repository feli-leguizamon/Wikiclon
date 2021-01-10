const express = require("express");
const app = express();
const db = require("./db");
const routes = require("./routes");
const path = require("path");
const nunjucks = require("nunjucks")
const bodyParser = require("body-parser")

// Middleware de Loggeo.
const volleyball = require("volleyball");

app.use(volleyball);
// Me permite atrapar forms de HTML y entenderlos. 
app.use(bodyParser.urlencoded({extended: true}))
// Me permite atrapar AJAX requests. 
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "/public")));

// apuntá nunjucks al directorio conteniendo templates y apagando el cacheo,
// configure devuelve una instancia Enviornment que vamos a querer usar para
// agregar Markdown después.
var env = nunjucks.configure("views", { noCache: true });
// hace res.render funcionar con archivos html
app.set("view engine", "html");
// cuando res.render funciona con archivos html, haz que use nunjucks para eso.
app.engine("html", nunjucks.render);

app.use(routes);

app.use((err, req, res, next) => {
  res.sendStatus(404).send(err);
});

db.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server escuchando en el puerto 3000..");
  });
});
