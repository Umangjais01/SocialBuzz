const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('JAIS, ROUTER IS RUNNING');

router.get('/',homeController.home);
router.use('/users',require('./users'));

module.exports=router;