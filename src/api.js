// api.js
const express = require('express');
const pool = require('./db');
const router = express.Router();
const crypto = require('crypto');
const fingerprintChecking = true;
const hourly = true;
const {newTicket, draw} = require('./lottery')
const {printEntry} = require('./printer')
const adminKey = crypto.randomBytes(8).toString('hex')
var cooldown = 30;
console.log("-----\nadmin key: " + adminKey + "\n-----")

// Define your API endpoints here
router.get('/api/data', async (req, res) => {
    try {
        const query = 'SELECT * FROM dataset d ORDER BY d.dsid DESC';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.post('/api/submit', async (req, res) => {
    const names = {
        battery: "Battery",
        ip: "IP Address",
        browser: "Browser",
        os: "Operating System",
        width: "Screen width",
        height: "Screen height",
        time: "Time",
        webGL: "WebGL enabled",
        localStorage: "Local storage allowed",
        cookies: "Cookies",
        touch: "Touchscreen",
        fingerprint: "Fingerprint"
    }
    let newEntry = req.body
    //console.log(newEntry)

    if (req.headers.hasOwnProperty('user-agent')) newEntry.useragent = req.headers['user-agent']
    newEntry.ip = req.ip
    let ticket = newTicket()
    //console.log("New Entry!")
    let keyValues = []
    let rawPrint = [];
    let insertPrt1 = []
    let insertPrt2 = []
    keyValues.push({name: names.time, value: (new Date()).toLocaleString('de-AT'), origName: "submittedat"})
    Object.keys(newEntry).forEach(k => {
        rawPrint.push(k)
        rawPrint.push(newEntry[k])
        let translatedKey = k
        //console.log(k)
        //console.log(names.hasOwnProperty(k))
        if (names.hasOwnProperty(k)) {
            translatedKey = names[k]
            let sanitized =k.replace(/'/g,"").replace(/-/g,"").replace(/&/g,"").replace(/;/g,"")
            insertPrt1.push(sanitized)
            sanitized = newEntry[k].toString().replace(/'/g,"").replace(/-/g,"").replace(/&/g,"").replace(/;/g,"")
            if(!["touch","width","height","webGL","battery","localStorage"].includes(k))insertPrt2.push("'" + sanitized + "'")
            else insertPrt2.push(sanitized )
        }
        keyValues.push({name: translatedKey, value: newEntry[k], origName: k})
    })
    if (hourly) rawPrint.push(Math.floor(new Date().getHours()).toString(16))
    const hash = crypto.createHash('sha256')
    hash.update(rawPrint.sort().join(""))
    newEntry.fingerprint = btoa(hash.digest().toString('hex'))
    try {
        const chck = await pool.query("SELECT * FROM dataset WHERE fingerprint = '"+newEntry.fingerprint+"' AND submittedat > now() - INTERVAL '"+cooldown+" minute'");
        if(chck.rows.length>0) {
            res.sendStatus(400)
            return
        }
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error'});
        return 0
    }
    insertPrt1.push("fingerprint")
    insertPrt2.push("'" + newEntry.fingerprint + "'")
    let SQLstr = "INSERT INTO dataset (" + insertPrt1.join(",") + ") VALUES (" + insertPrt2.join(",") + ");"
    //console.log(SQLstr)
    //console.log(SQLstr)
    try {
        const result = await pool.query(SQLstr);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error'});
        return 0
    }

    printEntry(keyValues, ticket, 0)
    res.json({ticket:ticket})
})
router.get('/api/admin/draw', async (req, res) => {
    try {
        let valid = req.query.adminKey === adminKey
        if (valid) {
            let winner = draw()
            if (winner === null) res.sendStatus(400)
            else res.send(winner)
        } else res.sendStatus(400)
    } catch (e) {
        console.log(e)
        res.sendStatus(400)
    }
})

router.get('/api/admin/testKey', (req, res) => {
    try {
        let valid = req.query.adminKey === adminKey
        res.sendStatus(valid ? 200 : 400)
    } catch (e) {
        res.sendStatus(400)
    }
})
router.post('/api/admin/reset', async (req, res) => {
    try {
        let valid = req.query.adminKey === adminKey
        if (valid) {
            const query = 'DELETE FROM dataset';
            const result = await pool.query(query);
            res.json(result.rows);
        } else res.sendStatus(400)
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});
router.delete('/api/admin/delete/:id', async (req, res) => {
    try {
        let valid = req.query.adminKey === adminKey
        if (valid) {
            const query = 'DELETE FROM dataset WHERE dsid='+req.params.id;
            const result = await pool.query(query);
            res.json(result.rows);
        } else res.sendStatus(400)
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});
router.post('/api/admin/cooldown', async (req, res) => {
    try {
        let valid = req.query.adminKey === adminKey
        if (valid) {
            if(req.body.hasOwnProperty("cooldown")) {
                cooldown = req.body.cooldown
                res.sendStatus(200)
            }
            else res.sendStatus(401)
        } else res.sendStatus(400)
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;
