//dependencies import
const express = require('express');
const app = express ();
app.use(express.json());

//routes import
const {authRouter} = require('./routes/auth');
const {postRouter} = require('./routes/post')

app.use('/api/v1',authRouter);
app.use('/api/v1/posts',postRouter);

app.listen(3000,() =>{
    console.log('server is running')
})