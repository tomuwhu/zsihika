const app = (express = require('express'))()
const cors = require('cors')
app.use(require('body-parser').json())
const database_name = "zshka"
const static_folder = "front-end/dist/"
const editor_folder = "editor/dist/"
const mysql = require('mysql')

const sql = mysql.createConnection({
    host: 'localhost',
    user: 'tnemeth',
    password: 'tom432npm run serve',
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

app.get(/docs/, (req, res) => {
    let nyt = {}
    sql.query(
        `SELECT     *
         FROM       docs 
         ORDER BY   dname`,
        (err, dl) => {
            if (err) {
                res.send(err)
            } else {
                res.send(dl)
            }
        })
})

app.use('/', express.static(static_folder))
app.use('/editor', express.static(editor_folder))

app.listen(3000)