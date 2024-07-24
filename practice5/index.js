const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const multerconfig=require('./config/multerconfig')

//models
const userModel = require('./models/user');
const postModel=require('./models/post');
const user = require('./models/user');


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//middleware
const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.send('You must log in first');
    }
    try {
        const data = jwt.verify(token, "secret");
        req.user = data;
        next();
    } catch (error) {
        res.clearCookie('token');
        res.redirect('/login');
    }
};


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/upload/profilepic', (req, res) => {
    res.render('profilepic');
});
app.post('/upload',isLoggedIn,multerconfig.single('image'),async (req,res)=>{
const data=await req.file.filename;
console.log(data);
 const userInfo=await findOne({email:req.user.email});
 console.log(userInfo);
 userInfo.profilepic=req.file.filename;
 await userInfo.save();
 res.redirect('/profile');
})
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/profile', isLoggedIn ,async (req, res) => {
    const {email}=req.user;
    const userData= await userModel.findOne({email}).populate("posts");
    res.render('profile',{user:userData});

});
app.get('/logout', (req, res) => {
    res.cookie('token', '');
    res.redirect('/login')
});


app.post('/register', async (req, res) => {
    const { username,name,age, email, password } = req.body;
    
    let user = await userModel.findOne({ email });
    if (user) {
        return res.status(500).send('account already exist');
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            const userData = await userModel.create({ username, name, email, age, password: hash });
            const token =jwt.sign({email:email,userid:userData._id}, "secret");
            res.cookie('token',token);
            res.redirect('/profile');
        })
    });
});

app.post('/login', async (req, res) => {
    const {  email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
        return res.status(500).send('something went wrong');
    }
    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            const token=jwt.sign({email},"secret");
            res.cookie('token',token);
            res.status(200).redirect('/profile')
        }else{
            res.redirect('/login');
        }
    });

});

app.post('/post',isLoggedIn,async (req,res)=>{

    const {content}=req.body;
    const user=await userModel.findOne({email:req.user.email});

    const post=await postModel.create({
        user:user._id,
        content
    })

    user.posts.push(post._id);
    await user.save();

    res.redirect('/profile');
})

app.listen(3000, () => {
    console.log('server started at port :  3000');
})