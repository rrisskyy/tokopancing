const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require("path");
const fs = require("fs")
const { addAbortSignal } = require('stream');

mongoose.connect('mongodb://localhost:27017/itemsDB', {useNewUrlParser: true});


const itemSchema = new mongoose.Schema ({
    name: {
        type:String,
        required:[true, "Tolong Masukkan Nama!"]
    },
    price:{
        type:Number,
        min:1000,
        max:10000000,
        required:[true, "Tolong Masukkan Harga!"]
    },
    itemType: {
        type:String,
        required:[true, "Tolong Masukkan Tipe Barang!"]
    },
    fileName: {
        type:String,
        required:[true, "Tolong Masukkan Tipe Barang!"]
    }
});

const Item = mongoose.model("Item", itemSchema);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '/public/uploads/images/')
    },
    filename: function (req, file, cb) {
        const extension = file.mimetype.split("/");
      cb(null, Date.now() + "." + extension[1]) //Appending .jpg
    }
  })
const upload = multer({storage: storage});
const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
    let [joran, reel, lure, hook, snap, kiliKili, nylon, timahPemberat, lainnya] = [[], [], [], [], [], [], [], [], []];
    Item.find({}, (err, itemsFound) => {
        if (err) {
            console.log(err);
        } else {
            itemsFound.forEach((item) => {

                switch(item.itemType) {
                    case "Joran":
                        joran.push(item);
                        break;
                    case "Hook":
                        hook.push(item);
                        break;
                    case "Reel":
                        reel.push(item);    
                        break;
                    case "Lure":
                        lure.push(item);
                        break;
                    case "Snap":
                        snap.push(item);
                        break;
                    case "Kili_Kili":
                        kiliKili.push(item);
                        break;
                    case "Nylon":
                        nylon.push(item);
                        break;
                    case "Timah_Pemberat":
                        timahPemberat.push(item);
                        break;
                    default:
                        lainnya.push(item);
                        break;
                };

            })
            let categories = ["Joran", "Reel", "Lure", "Mata Pancing", "Snap", "Kili Kili", "Nylon", "Timah Pemberat", "Lainnya"] 
            let itemsCategories = [joran, reel, lure, hook, snap, kiliKili, nylon, timahPemberat, lainnya]
            
            res.render("index", {
                items: itemsFound, 
                category: categories,
                itemsCategories: itemsCategories
            });
        }
    });        
})


app.get("/login", (req, res) => {
    res.render("login")
})



app.get("/admin", (req, res) => {
    Item.find({}, (err, itemsFound) => {
        if (err) {
            console.log(err);
        } else {
            res.render(__dirname + "/views/admin/index", {
                items:itemsFound
            });   
        };
    });
});

app.post("/admin/delete", (req, res) => {
    
    // delete
    if ( req.body.item_delete !== null ){
        // {
        //   _id: new ObjectId("6145983b0aab120f36ac55a3"),
        //   name: 'Daido Reno (1000)',
        //   price: 130000,
        //   itemType: 'Reel',
        //   fileName: '1631950907851.png',
        //   __v: 0
        // }
        // req.body berupa sebuah array seperti diatas (bukan sebuah object), maka akan dipisah dengan split(",")
        const arr = req.body.item_delete.split(",");
        // _id berada di index 0, dan dipisah lagi, dengan menggunakan split('"'),
        // karena string yang diinginkan berada di index ke 1, maka itu yg dipilih berlaku juga untuk filename
        const _id = arr[0].split('"');
        const fileName = arr[4].split("'")
        fs.unlink(__dirname + "/public/uploads/images/" + fileName[1], (err) => {
            if (err) throw err;
        });
        Item.findByIdAndRemove({_id : _id[1]}, (err) => {
            if(err){
                console.log(err)
            } else {            
                console.log("Success");
                res.redirect('/admin')
            }
        })
    }
})


app.get("/admin/post", (req, res) => {
    res.render(__dirname + "/views/admin/post")
});


app.post('/admin/post', upload.single('photo'), (req, res) => {
    const itemName = req.body.itemName;
    const price = req.body.price;
    const itemType = req.body.itemType;
    const photoName = req.file.filename;
    const extension = req.file.mimetype.split("/");

    const item = new Item ({
        name: itemName,
        price: price,
        itemType: itemType,
        fileName: photoName
    });
    item.save()
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server start at port 3000");
})