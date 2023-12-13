const express = require('express');
const postsRouter = express.Router();

/**
 * GET /posts
 */
postsRouter.get('/', async (req, res) => {
  const posts = await req.database.collection('posts').aggregate([
    {
      $lookup: { // Join comments
        from: 'comments',
        localField: 'id',
        foreignField: 'postId',
        as: 'comments'
      }
    }
  ]).toArray();

  res.json(posts);
});

/**
 * GET /posts/:id
 */
postsRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const post = await req.database.collection('posts').aggregate([
    {
      $match: {
        id: parseInt(id)
      },
    },
    {
      $lookup: { // Join comments
        from: 'comments',
        localField: 'id',
        foreignField: 'postId',
        as: 'comments'
      }
    }
  ]).toArray({ limit: 1 });

  if (post) {
    res.json(post);
  } else {
    res.status(404).send('Post not found!');
  }
});

module.exports = postsRouter;