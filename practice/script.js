const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs'); //requiring filestream


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    console.log(files);
    res.render('index', { files });
  })
});

app.get('/files/:filename', (req, res) => {
  fs.readFile(`./files/${req.params.filename}`,'utf-8',(err,filedata)=>{
    res.render('show',{filename:req.params.filename, filedata:filedata});
    // console.log(filedata)
  })});

  app.get('/edit/:filename', (req, res) => {
    fs.readFile(`./edit/${req.params.filename}`,'utf-8',(err,filedata)=>{
      res.render('edit',{filename:req.params.filename, filedata:filedata});
      // console.log(filedata)
    });
  });

  app.post('/edit', (req, res) => {
    fs.rename(`./files/${req.body.name}`,`./files/${req.body.newName}`,(err)=>{

      res.redirect('/');
      // console.log(req.body);
    })
  });

app.post('/create', (req, res) => {
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,(err)=>{
    res.redirect('/');
  });
  

  
});


app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
