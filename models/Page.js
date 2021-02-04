const S = require("sequelize")
const db = require("../db")

class Page extends S.Model{}

Page.init({
    title: {
        type: S.STRING,
        allowNull: false
    },
    urlTitle: {
        type: S.STRING,
        allowNull: false
 
    },
    content: {
        type: S.TEXT,
        allowNull: false
    },
    status: {
        // lo ocupamos cuando necesitamos una lista predefinida de valores 
        type: S.ENUM("open", "closed")
    },
    date: {
        type: S.DATE,
        defaultValue: S.NOW
    },
    route: {
        // en los virtuals es obligatorio poner el get o el set
        type: S.VIRTUAL,
        get() {
            // getDataValue significa ir a la base de datos a buscar el valor que tengo en la columna urlTitle
            return `/wiki/${this.getDataValue("urlTitle")}`
        }
    },
    tags: {
        type: S.ARRAY(S.STRING),
        defaultValue: [],
        set(tags) {
            // si tiene tags, los tags seteados iniciales van a ser esos, sino voy a hacer que sea un array vacio
            tags = tags || []
            // dado un string que vos me pasas, por ejemplo "policial novela deportivo" lo termino convirtiendo en ["policial", "novela", "deportivo"]
            if(typeof tags === "string") {
                tags = tags.split(",").map((str) => {
                    return str.trim()
                })
            }
            this.setDataValue("tags", tags)
        }
    }
}, {sequelize: db, modelName: "page"})

// hooks ==> formas de acceder al ciclo de vida del modelo.
// beforeValidate es anterior al beforeCreate. 

Page.beforeValidate((page, options) => {
    if(page.title) {
        // regEx ==> mayusculas a minisculas, espacios por guiones, le saca las tildes y un par mas de cositas. La urlTitle la setea con respecto al titulo original. 
        page.urlTitle = page.title.replace(/\s+/g, "_").replace(/\W/g, " ")
        // es una de las formas de pushear el valor correspondiente a urlTitle 
        options.fields.push("urlTitle")
    }
})

// metodo de instancia ==> pensa en la tabla de paginas y en todas sus filas. Cuando vos vas a hacer un metodo de instancia, estas focalizado en una sola fila de esa tabla. Apunta a un solo registro como por ejemplo: cambiame el nombre, aumentame uno la edad.

// buscame todas las paginas que tengan los mismos tags que tengo yo pero no me incluyas. 
Page.prototype.findSimilar = function() {
    return Page.findAll({
        where: {
            id: {
                [S.Op.not]: this.id
            },
            tags: {
                [S.Op.overlap] : this.tags
            }
        }
    })
}

// metodo de clase ==> estas focalizado en todo un subconjunto o todo un conjunto de tablas. Apunta a varios registros.

// si me dice findByTag yo podria sospechar que es un metodo de clase porque puedo con un tag policial encontrar un subconjunto grande

Page.findByTag = function(tag) {
    return Page.findAll({
        where: {
            tags: {
                [S.Op.overlap] : [tag]
            }
        }
    })
}

module.exports = Page

