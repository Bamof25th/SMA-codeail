const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentsControllers = require('../controllers/comments_controller');


router.post('/create',passport.checkAuthentication, commentsControllers.create);



module.exports = router;