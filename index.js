const express = require('express');
var cors = require('cors');
const path=require("path");
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const mongoose = require("mongoose");
const signup = require('./models/signup');

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cors());
app.use(bodyParser.json())
app.use(upload.array()); 
app.use(express.static(path.join(__dirname, "public")));
app.set("view options", {layout: false});
const views=path.join(__dirname, "public");


const uri="mongodb+srv://user1:maeeUIRSit6nP4Oq@cluster0.scfp1cz.mongodb.net/profile?retryWrites=true&w=majority";
mongoose.connect(uri);
const db=mongoose.connection;

db.on("error", console.error.bind(console, 'connection error : '));
db.once("open", ()=>{
    console.log("Connected!");
});

app.get('/', (req, res) => {
    res.send('Hello World!');
  })

app.get('/home', (req, res) => {
    res.sendFile(views+`/home.html`);
})

app.get('/help', (req, res) => {
    res.sendFile(views+`/help.html`);
})

app.get('/popular', (req, res) => {
    res.sendFile(views+`/popular.html`);
})

app.get('/categories', (req, res) => {
    res.sendFile(views+`/categories.html`);
})

app.get('/about', (req, res) => {
    res.sendFile(views+`/about.html`);
})

app.get('/trending', (req, res) => {
    res.sendFile(views+`/trending.html`);
})

app.get('/profile', (req, res) => {
    res.sendFile(views+`/profile.html`);
})

app.get('/tmdb', (req, res) => {
    res.sendFile(views+`/tmdb.html`);
})


// Login and Signup

app.get('/signup', (req, res) => {
    res.sendFile(views+`/signup.html`);
})

app.post('/signup', async (req, res) => {
    const user = await signup.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        occupation: req.body.occupation,
        image: req.body.image,
        dob: req.body.dob,
        email: req.body.email,
        password: req.body.password,
    }).then((response)=>{
        res.json(response).end();
    }).catch((error)=>{
        console.log(error);
        res.status(400);
        res.json(error).end();
    })
})

app.get('/login', (req, res) => {
    res.sendFile(views+`/login.html`);
})

app.post('/login', async (req, res) => {
    signup.findOne({email: req.body.email, password: req.body.password})
    .then((response)=>{
        if(response===null){
            res.status(400);
            res.json({status: false, message: 'User not found. Check your Email and Password'}).end();
        } else {
            res.json({status: true, message: 'Logged In Successfully', email: response.email, pfp: response.image}).end();
        }
    })
})

app.get('/profileData', async (req, res) => {
    const email=req.query.email;
    console.log(email);
    if(email===undefined || email===null || email===''){
        res.status(400);
        res.json({status: false, message: 'User details not found'}).end();
    } else {
        signup.findOne({email:email})
        .then((response)=>{
            if(response===null){
                console.log(response);
                res.status(400);
                res.json({status: false, message: 'User details not found'}).end();
            } else {
                res.send({data: response, status: true}).end();
            }
        })
    }
})

app.post('/updatePicture', async (req, res) => {
    const email=req.body.email;
    if(email===undefined || email===null || email===''){
        res.status(400);
        res.json({status: false, message: 'User details not found'}).end();
    } else {
        signup.findOneAndUpdate({ email: email }, { image: req.body.image })
        .then((response)=>{
            console.log(response);
            if(response===null){
                res.status(400);
                res.json({status: false, message: 'User details not found'}).end();
            } else {
                res.send({data: response, status: true}).end();
            }
        })
    }
});

app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
})