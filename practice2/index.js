const express = require('express');
const app = express();
const path=require('path')
const port = 3000;
const userModel=require('./models/user');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {
  res.render('index')
});
app.get('/read', async(req, res) => {
  const userData=await userModel.find();
  res.render('read',{users:userData});
});
app.get('/edit/:userid', async(req, res) => {
  const userData=await userModel.findOne({_id:req.params.userid});
  res.render('edit',{user:userData});
});

app.post('/update/:userid', async(req, res) => {
  const {name,email,url}=req.body;
  const userData= await userModel.findOneAndUpdate({_id:req.params.userid},{name,email,url},{new:true}) ;
  res.redirect('/read')
});

app.get('/delete/:id', async(req, res) => {
  const userData=await userModel.findOneAndDelete({_id:req.params.id});
  res.redirect('/read');
});

app.post('/create', async (req, res) => {
  const {name,email,url}=req.body;
  const userData= await userModel.create({name,email,url}) ;
  res.redirect('/read')
});



app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});