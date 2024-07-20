const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const userModel = require('./models/user')

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index')
});
app.post('/create', (req, res) => {
    const { username, email, password, age } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {

            const userData = await userModel.create({ username, email, password: hash, age });

            const token=jwt.sign({email},"secret");
            res.cookie('token',token);

            res.send(userData)
        });
    });
});
app.get('/login',(req,res)=>{
    res.render('login');
})

app.post('/login',async (req,res)=>{
    const {email,password}=req.body;
    const user= await userModel.findOne({email});
    if(!user) return res.send('something went wrong');
    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            const token=jwt.sign({email},"secret");
            res.cookie('token',token);
            res.send('you are loged in');
        }else{
            res.send('something went wrong');
        }
    })
})

app.get('/logout',(req,res)=>{
    res.cookie('token', '');
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`server started and listening on port ${port}`);
});