const express = require('express')
const bodyparser = require('body-parser')
const _ = require('lodash')
const mongoose = require('mongoose')


const app = express();
app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))


mongoose.connect('mongodb+srv://pakhtun_bilal:Ikidgaf6.9@cluster0.vhqvbk9.mongodb.net/todolistDB')

const itemsSchema = new mongoose.Schema ( {
    name : String
})

const Item = mongoose.model('Item',itemsSchema)

const work1 = new Item({
    name:"ek kaam karo",
})
const work2 = new Item({
    name:"do kaam karo",
})
const work3 = new Item({
    name:"teen kaam karo",
})

const defaultItems = [work1,work2,work3]

const listschema ={
    name : String,
    items : [itemsSchema]
}

const List = mongoose.model('list',listschema) 

app.get('/', async(req, res) => {
    let day = 'Today'
    let found = await Item.find({})
    if(found.length == 0){
    await   Item.insertMany(defaultItems)
   }else{
 
   }
    res.render("list", { listtitle: day, NewListItems: found })
});

app.get('/:custom',async(req,res)=>{
    const customlist = _.capitalize(req.params.custom)

    let found = await List.findOne({name:customlist})
    if(found){
        res.render("list",{ listtitle:found.name, NewListItems:found.items})
    }else{
        const list = await new List({
            name : customlist,
            items: defaultItems
        })
        await list.save()
        res.redirect('/'+customlist)
    }
    
})


app.post('/', async(req, res) => {

    let InputName = req.body.input;
    let listName = req.body.list
    const Input ={
        name :InputName
    }

    if(listName === "Today"){
      await  Item.insertMany(Input);
    res.redirect('/')
    }else{
        let foundList = await List.findOne({name:listName})
       await foundList.items.push(Input)
       await foundList.save();
        res.redirect('/' + listName)
    }

    

});

app.post('/delete', async(req,res)=>{
   const CheckedId =req.body.checkbox;
   const ListName = req.body.ListName;

   if(ListName === "Today"){
   await Item.deleteOne({_id :CheckedId})
   res.redirect('/')
   }else{
   let found =  await List.findOneAndUpdate(
        {name:ListName},
        {$pull:{
            items: {
                _id : CheckedId
            }
        }}
    )
    res.redirect('/' + ListName)
   }

   
})





app.get('/about', (req, res) => {
    res.render("about");
})


app.listen(3000, () => { console.log("server running on port 3000") })