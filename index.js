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

app.get(/kulcsszavak/, (req, res) => {
    let nyt = {}
    sql.query(
        `SELECT     *
         FROM       ksz 
         ORDER BY   kulcsszo`,
        (err, kszl) => {
            if (err) {
                res.send(err)
            } else {
                res.send(kszl)
            }
        })
})

app.use('/', express.static(static_folder))

app.listen(3000)