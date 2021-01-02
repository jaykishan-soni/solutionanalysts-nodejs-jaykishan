import { Request, Response } from 'express';
import * as l10n from 'jm-ez-l10n';
import { Constants } from '../../config/constants';
import { ResponseBuilder } from '../../helpers/responseBuilder';
import { ArticleUtils } from './articleUtils';
import { Log } from '../../helpers/logger';

export class ArticleController {
  private articleUtils: ArticleUtils = new ArticleUtils();
  private logger = Log.getLogger();

  // Get all articles
  public getAllArticles = async (req: any, res: Response) => {
    const { skip = Constants.DEFAULT_PAGE, limit = Constants.DEFAULT_LIMIT } = req.query;
    const article: ResponseBuilder = await this.articleUtils.getAllArticles(skip, limit);
    res.status(article.code).json(article.result);
  };

  // Get article detail by id
  public getArticleDetail = async (req: any, res: Response) => {
    const { articleId } = req.params;
    const article: ResponseBuilder = await this.articleUtils.getArticleDetail(articleId);
    res.status(article.code).json(article.result);
  };

  // Update article detail by id
  public updateArticleDetail = async (req: any, res: Response) => {
    const { articleId } = req.params;
    const articleDetail = req.body;
    const article: ResponseBuilder = await this.articleUtils.updateArticleDetail(articleId, articleDetail);
    res.status(article.code).json(article.result);
  };

  // Post article
  public postArticle = async (req: any, res: Response) => {
    const articleDetail = req.body;
    const article: ResponseBuilder = await this.articleUtils.postArticle(articleDetail);
    res.status(article.code).json(article.result);
  };


}
