// Import only what we need from express
import { Router } from 'express';
import { Validator } from '../../validate';
import { CommentController } from './commentController';
import { CommentMiddleware } from './commentMiddleware';
import { CommentModel } from './commentModel';

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const commentController = new CommentController();
const commentMiddleware = new CommentMiddleware();

router.post('/:articleId', v.validate(CommentModel), commentController.postComment);
router.get('/:articleId', commentController.getAllComments);

// Export the express.Router() instance to be used by server.ts
export const CommentRoute: Router = router;
