const express = require("express")
const router = express.Router()
const {Page, User} = require("../models")

router.get("/search", (req, res, next) => {
    if(!req.query.tag) return res.render("searchTag")

     Page.findByTag(req.query.tag)
    .then((pages) => {
        res.render("index", {
            pages: pages
        })
    }) 
})

router.get("/", (req, res, next) => {
    Page.findAll()
    .then((pages) => {
        res.render("index", {
            pages: pages
        })
    })
    .catch(next)
    // Page.findAll()
    // .then((pages) => res.send(pages))
})

router.get("/add", (req, res, next) => {
    res.render("addpage")
})

router.post("/", (req, res, next) => {

    // sirve para evitar usuarios duplicados. El findOrCreate no te devuelve directamente el usuario.
    User.findOrCreate({
        where: {
            name: req.body.name,
            email: req.body.email
        }
    })
    .then((data) => {
        const usr = data[0]
        Page.create({
            title: req.body.title,
            content: req.body.content,
            status: req.body.status,
            tags: req.body.tags
        })
        .then(page => {
            page.setAuthor(usr)
            res.redirect("/wiki")
        })
       

    })
    .catch(next)

    /* Page.create({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status
    })
    .then((paginaCreada) => {
        User.create({
            name: req.body.name,
            email: req.body.email
        })
        .then((usuarioCreado) => {
            res.send({usuarioCreado, paginaCreada})
        })
    }) */
})

// si tengo una pagina de titulo Hola Chau, el urlTitle seria hola_chau


router.get("/:urlTitle", (req, res, next) => { 
    Page.findOne({
        where: {
            urlTitle: req.params.urlTitle
        }
    })
    .then((page) => {
        if(!page) return res.send("No se encontro tu pagina")
        page.getAuthor()
        .then(author => {
            page.author = author
            res.render("wikipage", {page})
        })
    })
})

router.get("/:urlTitle/edit",(req, res, next) => {
    Page.findOne({
        where: {
            urlTitle: req.params.urlTitle
        }
    })
    .then((page) => {
        res.render("editpage", {
            page: page
        })
    })
  })


router.post("/:urlTitle/edit",(req, res, next) => {
    Page.findOne({
        where: {
            urlTitle: req.params.urlTitle
        }
    })
    .then((page) => {
        // recorre el req.body y va modificando cada valor de la pagina (por ejemplo, el titulo, el contenido) por lo que tenga req.body 
        for(var key in req.body) {
            console.log("req body", req.body)
            page[key] = req.body[key]
        }
        page.save()
        .then((updatedPage) => {
            console.log("updated page", updatedPage)
            res.redirect(updatedPage.route)
        })
    })
  })

router.get("/:urlTitle/delete", (req, res, next) => {
    Page.destroy({
        where: {
            urlTitle: req.params.urlTitle
        }
    })
    .then(() => res.redirect("/wiki"))
})

router.get("/:urlTitle/similar", (req, res, next) => {
    Page.findOne({
        where: {
            urlTitle: req.params.urlTitle
        }
    })
    .then((paginaEncontrada) => {
        return paginaEncontrada.findSimilar()
        .then((paginasEncontradas) => {
            res.render("index", {
                pages: paginasEncontradas
            })
        })
    })
} )
module.exports = router