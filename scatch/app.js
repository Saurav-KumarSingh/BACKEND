const express=require('express');
const app= express();
const cookieParser= require('cookie-parser');
const path= require('path');
const db= require('./config/mongoose-connect');
const ownersRoute=require('./routes/ownersRoute')
const usersRoute=require('./routes//usersRoute')
const productsRoute=require('./routes/productsRoute')

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');

const port=3000;

// routes
app.use('/owners',ownersRoute);
app.use('/users',usersRoute);
app.use('/products',productsRoute);


app.listen(port,()=>{
    console.log('ser is started');
});