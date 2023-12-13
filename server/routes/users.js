const express = require('express');
const usersRouter = express.Router();

/**
 * GET /users
 */
usersRouter.get('/', async (req, res) => {
  const users = await req.database.collection('users').find().toArray();
  res.send(users);
});

/**
 * GET /users/:id
 */
usersRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const user = await req.database.collection('users').findOne({ id: parseInt(id) });

  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found!');
  }
});

module.exports = usersRouter;