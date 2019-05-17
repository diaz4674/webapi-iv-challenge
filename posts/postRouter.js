const express = require ('express');

const Posts = require('./postDb.js');
const router = express.Router();


//GET posts
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.get(req.query)
        res.status(200).json(posts)
    } catch(err){
        res.status(500).json({message: 'Error retriving the Posts'})
    }
});

//GET post BY ID
router.get('/:id', validatePostId, (req, res) => {
    res.status(200).json(req.post)
});


//DELETE
router.delete('/:id', validatePostId, async (req, res) => {
    const removePost = await Posts.remove(req.params.id);
    res.status(200).json(removePost)
});

//PUT
router.put('/:id', (req, res) => {

});

// custom middleware


//Validate ID 

async function validatePostId(req, res, next) {
    try{
        const {id} = req.params;
        const post = await Posts.getById(id)

        if(post){
            req.post = post;
            next();
        } else {
            next({message: 'Post not found; invalid id'})
        }
    }
    catch(err){
            res.status(500).json({ message: 'Failed to process request' })
    }
} 

module.exports = router;