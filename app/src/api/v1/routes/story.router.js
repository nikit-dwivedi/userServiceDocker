const express = require('express');
const router = express.Router();

const storyController = require('../controllers/story.controller');
const { authenticateUser } = require('../middlewares/authToken');

router.get('/', authenticateUser,storyController.getStories);

router.post('/', storyController.addNewStory);

module.exports = router;