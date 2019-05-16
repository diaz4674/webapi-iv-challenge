const express = require('express');

const Users = require('./userDb.js')
const Post = require('../posts/postDb.js')
const router = express.Router();


//POST router
router.post('/', validatePost, async (req, res) => {
    const newUser = await Users.insert(req.body)
    res.status(200).json(newUser);
});



//POST with ID
router.post('/:id/posts', validateUserId, async (req, res) => {
    const {id} = req.params;
    //Getting objects made by user, and making a new key to set set a new object
    const newPost = {...req.body, user_id: id}
    try {
    const post = await Post.insert(newPost)
    res.status(200).json(post);}
    catch (err){
        next({message: 'no'})
    }
});


//GET router
router.get('/', async (req, res) => {
    try {
        const users = await Users.get(req.query);
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Error retriving the Users'})
    }
});

//GET by ID
router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user)
});

router.get('/:id/posts', validatePost, async (req, res) => {

    try{
        const user = await Users.getUserPosts(req.body);
        if(user){
            res.status(200).json(user);
        } else {
            res.status(400).json({message: "missing post data"})
        }
    } catch(err){ 
       next({message: "missing required text field"})
    }
});


//DELETE
router.delete('/:id', validateUserId, async (req, res) => {
    const removedUser = await Users.remove(req.params.id);
    res.status(200).json(removedUser)
});

//PUT
router.put('/:id', validateUserId, validateUser, async (req, res) => {
    try{
        const user =await Users.update(req.params.id, req.body)
        if(user){
            res.status(200).json(user);
        } else {
            res.status(404).json({message: 'The user could not be found'})
        }
    } catch(err){
        res.status(500).json({
            message: 'Error updating the user'
        })
    }
});

//custom middleware

//Validate by ID
async function validateUserId(req, res, next) {
    try{
        const {id} = req.params;
        const user = await Users.getById(id)

        if(user){
            req.user = user;
            next();
        } else {
            next({message: 'User not found; invalid id'})
        }
    } catch (err) {
        res.status(500).json({message: 'Failed to process request'})
    }
};


//Validate User
function validateUser(req, res, next) {
    if(req.body.name && Object.keys(req.body.name).length){
        console.log(Object.keys(req.body).length)
        next();
    } else {
        next({message: 'please include request body'})
    }
};

//Validate POST
 function validatePost (req, res, next) {
    if(req.body && Object.keys(req.body).length) {
            if(req.body.name && Object.keys(req.body.name).length){
            next();
        } else {
            res.status(400).json({message: "missing required text field" })
        }
} else {
    next({message: "missing post data"})
}
}

module.exports = router;
