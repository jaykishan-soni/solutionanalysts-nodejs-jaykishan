// Import only what we need from express
import { Router } from 'express';
import { Validator } from '../../validate';
import { ArticleController } from './articleController';
import { ArticleMiddleware } from './articleMiddleware';
import { ArticleModel, UpdateArticleModel } from './articleModel';

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const articleController = new ArticleController();
const articleMiddleware = new ArticleMiddleware();

router.get('/', articleController.getAllArticles);
router.post('/', v.validate(ArticleModel), articleController.postArticle);
router.post('/:articleId', v.validate(UpdateArticleModel), articleController.updateArticleDetail);
router.get('/:articleId', articleController.getArticleDetail);

// Export the express.Router() instance to be used by server.ts
export const ArticleRoute: Router = router;
