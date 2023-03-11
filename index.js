const express = require('express')
const bodyparser = require('body-parser')
const date = require(__dirname + "/date.js")


const app = express();
app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))


var items = ["Buy food", "Eat food"];
var workitems = [];


app.get('/', (req, res) => {
    let day = date.getDate()
    res.render("list", { listtitle: day, NewListItems: items })
})


app.post('/', (req, res) => {
    let item = req.body.input;
    let list = req.body.list

    if (list === "work") {
        workitems.push(item)
        res.redirect("/work")
    } else {
        items.push(item)
        res.redirect('/')
    }


});


app.get('/work', (req, res) => {
    res.render("list", { listtitle: "work", NewListItems: workitems })
})


app.get('/about', (req, res) => {
    res.render("about");
})


app.listen(3000, () => { console.log("server running on port 3000") })