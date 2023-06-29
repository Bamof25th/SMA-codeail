const express = require('express');
const router = express.Router();

const postsControllers = require('../controllers/posts_controller');

router.post('/create', postsControllers.create);



module.exports = router;