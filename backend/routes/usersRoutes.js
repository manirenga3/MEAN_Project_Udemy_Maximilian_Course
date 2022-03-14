import express from 'express';

import * as UsersControllers from './../controllers/usersControllers.js';

export const router = express.Router();

router.post('/login', UsersControllers.login);
router.post('/signup', UsersControllers.signup);
