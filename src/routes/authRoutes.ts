import * as express from 'express';
import * as userController from '@src/controllers/auth-controller';
import * as commentsController from '@src/controllers/comments-controller';

import { body } from 'express-validator';

const router: express.Router = express.Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 6, max: 32 }),
  userController.registration
);
router.post("/validate", userController.validateRegistration);
router.post("/validate-login", userController.validateLogin);
router.post("/login", userController.login);
router.delete("/delete-user/:id", userController.deleteUser)
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);

router.get("/:userId/comments", commentsController.getCommentsForUser);


export default router;
