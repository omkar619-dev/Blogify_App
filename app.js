require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const cookieParser = require("cookie-parser");
const Blog = require('./models/blog');
const User = require('./models/user');
const checkForAuthCookie = require('./middlewares/authentication');


const app = express();
const PORT = process.env.PORT || 8385;
mongoose.connect(process.env.MONGO_URL).then(e=>{console.log('Connected to database')}).catch(e=>{console.log('Error connecting to database')});

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthCookie('token'));
app.use(express.static(path.resolve('./public')));
app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({}).sort({createdAt: -1});
    console.log(req.user); // Debugging
    res.render('home', {
        user: req.user,
        blogs: allBlogs,
        
    });
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)});

