const express = 'express';

const Posts = require('./postDb.js');
const router = express.Router();

router.get('/', async (req, res) => {
const posts = await Posts.get(req.body)
res.status(200).json(posts)
});

router.get('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

// custom middleware

function validatePostId(req, res, next) {

};

module.exports = router;