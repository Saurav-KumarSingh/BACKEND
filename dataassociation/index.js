const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');


app.get('/', (req, res) => {
    res.send('hello')
});

app.get('/create', async (req, res) => {
    const userData =await userModel.create({
        username: 'ram',
        email: 'ram@gmail.com',
        age: 15,
    })
    res.send(userData);
});
app.get('/post/create', async (req, res) => {
    const postData =await postModel.create({
        postdata: 'to kAisE hain aap',
        user: '669b43cb2d26ab1a60f90c70',
    })

    const userData=await userModel.findOne({_id:'669b43cb2d26ab1a60f90c70'})

    userData.posts.push(postData._id);
    await userData.save();

    res.send({postData, userData});
});
app.listen('3000', () => {
    console.log('server started')
});