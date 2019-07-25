const url = require('url');
const express = require("express")
const app = express()
const path = require("path")
const db = require('./db')

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
db.Open(app).then((state) => {
    if (state) {
        console.log('DB Server connected...')
    }
}).catch((err) => {
    console.log(err)
})

// GET CUSTOMERS
app.get('/api/customers', (req, res) => {
    const con = app.get('CONNECTION')
    sql = `SELECT CompanyName,CustomerID FROM customers ORDER BY CompanyName`
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json({ state: 'error', message: err.message })
        } else {
            if (result.length > 0) {
                res.json({ state: 'success-all', message: result })
            } else {
                res.json({ state: 'error', message: `No results!!!` })
            }
        }
    })
})

// GET CUTOMER DETAIL
app.get('/api/custdetails/:custID', (req, res) => {
    const con = app.get('CONNECTION')
    let custID = req.params.custID;
    sql = `SELECT * FROM customers where CustomerID = '${custID}'`
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json({ state: 'error', message: err.message })
        } else {
            if (result.length > 0) {
                res.json({ state: 'success-all', message: result })
            } else {
                res.json({ state: 'error', message: `No results!!!` })
            }
        }
    })
})

//GET ORDERS
app.get('/api/order/:custID', (req, res) => {
    const con = app.get('CONNECTION')
    let custID = req.params.custID;
    sql = `SELECT * FROM orders where CustomerID = '${custID}'`
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json({ state: 'error', message: err.message })
        } else {
            if (result.length > 0) {
                res.json({ state: 'success-all', message: result })
            } else {
                res.json({ state: 'error', message: `No results!!!` })
            }
        }
    })
})

//GET ORDER DETAILS
app.get('/api/orderdetails/:OrderID', (req, res) => {
    const con = app.get('CONNECTION')
    let orderID = req.params.OrderID;
    sql = `SELECT od.OrderID,od.ProductID,products.ProductName,od.UnitPrice,od.Quantity,od.Discount 
    FROM (\`order details\`AS od INNER JOIN products ON products.ProductID = od.ProductID) HAVING od.OrderId = '${orderID}'`
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json({ state: 'error', message: err.message })
        } else {
            if (result.length > 0) {
                res.json({ state: 'success-all', message: result })
            } else {
                res.json({ state: 'error', message: `No results!!!` })
            }
        }
    })
})

let server = app.listen(5000, () => { console.log("server opening on port 5000") });