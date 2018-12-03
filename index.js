const app = (express = require('express'))()
const cors = require('cors')
app.use(require('body-parser').json())
const database_name = "zshka"
const static_folder = "front-end/dist/"
const mysql = require('mysql')

const sql = mysql.createConnection({
    host: 'localhost',
    user: 'nt',
    password: '123',
    database: database_name
})

app.use(cors())

app.get(/getalldata/, (req, res) => {
    let nyt = {}
    sql.query(
        `SELECT * FROM user ORDER BY nev`,
        (err, users) => {
            if (err) {
                res.send(err)
            } else {
                sql.query(
                    `SELECT     *
                     FROM       meccsek 
                     ORDER BY   mikor`,
                    (err, meccsek) => {
                        if (err) {
                            res.send(err)
                        } else {
                            res.send({
                                users,
                                meccsek
                            })
                        }
                    })
            }

        }
    )
})

app.use('/', express.static(static_folder))

app.listen(3000)