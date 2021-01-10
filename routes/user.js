const express = require("express");
const router = express.Router();
const { User, Page } = require("../models");

router.get("/", (req, res, next) => {
  
  // catch ==> errores de procesamiento o de base de datos.
  User.findAll().then((users) => {
    res.render("users", {
      users: users
    })
  })
  .catch(err => next(err))
});

router.get("/:id", (req, res, next) => {
  User.findByPk(req.params.id)
  .then((usuario) => {
    //res.send(usuario)
    Page.findAll({
      where: {
        authorId: req.params.id
      }
    })
    .then((paginas) => {
      res.render("user", {
        user: usuario,
        pages: paginas
      })
    })
  });
});


module.exports = router;
