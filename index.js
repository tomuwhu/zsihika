const app = (express = require('express'))()
const cors = require('cors')
app.use(require('body-parser').json())
const database_name = "bevinfo"
const static_folder = "front-end/dist/"
const editor_folder = "editor/dist/"
const mysql = require('mysql')
const fileUpload = require('express-fileupload')
app.use(fileUpload())

const sql = mysql.createConnection({
    //host: 'mysql',
    host: 'localhost',
    user: 'tnemeth',
    password: 'tom432',
    database: database_name
})

app.use(cors())

app.post('/upload', (req, res) => {
    //console.log(res.files)
    console.log(req.files)
    
    res.send('szeva')
    /*
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send('No files were uploaded.');
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('/Telemetry/filename.jpg', function(err) {
      if (err)
        return res.status(500).send(err);
      res.send('File uploaded!');
    });*/
} )

app.post(/docsszurve/, (req, res) => {
    let szures =  req.body.kszol.map( v => `kt.ksz = ${v.id}`).join(' or ')
    let n = req.body.kszol.length
    sql.query( `
            SELECT  did, dname, kt.osz, count(did) n
            FROM 	docs, kt
            WHERE 	docs.did = kt.docid 
                            and ( ${ szures } )
            GROUP BY did, kt.osz
            HAVING n=${ n }`,
        (err, dl) => {
            if (err) {
                res.send(err)
            } else {
                res.send(dl)
            }
        })
})

app.post(/kszl/, (req, res) => {
    sql.query( `
            SELECT * 
            FROM kt,ksz
            WHERE kt.ksz=ksz.id and
                        docid=${req.body.docs}
            AND osz=${req.body.osz}
        `,
        (err, dl) => {
            if (err) {
                res.send(err)
            } else {
                res.send(dl)
            }
        })
})

app.post(/ujksz/, (req, res) => {
    sql.query( `
            INSERT INTO ksz (kulcsszo, ktip) 
            VALUES ( '${req.body.kulcsszo}', '${req.body.ktip}' )
        `,
        (err, dl) => {
            if (err) {
                res.send(err)
            } else {
                res.send(dl)
            }
        })
})

app.post(/addksz/, (req, res) => {
    sql.query( `
            INSERT INTO kt (ksz,docid,osz) 
            VALUES ( ${req.body.ksz}, ${req.body.docs}, ${req.body.osz} )
        `,
        (err, dl) => {
            if (err) {
                res.send(err)
            } else {
                res.send({ ok: true })
            }
        })
})

app.post(/addujold/, (req, res) => {
    sql.query( `
            UPDATE docs SET osz = ${ req.body.osz+1 }
            WHERE did = ${req.body.did} 
        `,
        (err, dl) => {
            if (err) {
                res.send(err)
            } else {
                res.send({ ok: true })
            }
        })
})

app.post(/removeujold/, (req, res) => {
    sql.query( `
            UPDATE docs SET osz = ${ req.body.osz-1 }
            WHERE did = ${req.body.did} 
        `,
        (err, dl) => {
            if (err) {
                res.send(err)
            } else {
                res.send({ ok: true })
            }
        })
})

app.post(/newdoc/, (req, res) => {
    sql.query( `
            INSERT INTO docs (dname,osz,year) 
            VALUES ( '${req.body.dname}', ${req.body.osz}, ${req.body.year} )
        `,
        (err, dl) => {
            if (err) {
                res.send(err)
            } else {
                res.send(dl)
            }
        })
})

app.post(/delksz/, (req, res) => {
    sql.query( `
            DELETE FROM kt
            WHERE ksz = ${req.body.ksz} and docid=${req.body.docs} and osz = ${req.body.osz}
        `,
        (err, dl) => {
            if (err) {
                res.send(err)
            } else {
                res.send({ ok: true })
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