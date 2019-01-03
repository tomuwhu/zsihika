const app = (express = require('express'))()
const cors = require('cors')
app.use(require('body-parser').json())
const database_name = "bevinfo"
const static_folder = "front-end/dist/"
const editor_folder = "editor/dist/"
const mysql = require('mysql')

const sql = mysql.createConnection({
    host: 'mysql',
    //host: 'localhost',
    user: 'tnemeth',
    password: 'tom432',
    database: database_name
})

app.use(cors())

app.post(/docsszurve/, (req, res) => {
    let szures =  req.body.kszol.map( v => `kt.ksz = ${v.id}`).join(' and ')
    let n = req.body.kszol.length
    sql.query( `
        SELECT  did,dname, count(did) n
        FROM 	docs,kt
        WHERE 	docs.did = kt.docid	 
                        AND 
                        ( ${ szures } )
        GROUP BY did
        HAVING n = ${ n }
        `,
        (err, dl) => {
            if (err) {
                res.send(err)
            } else {
                res.send(dl)
            }
        })
})

app.get(/kulcsszavak/, (req, res) => {
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