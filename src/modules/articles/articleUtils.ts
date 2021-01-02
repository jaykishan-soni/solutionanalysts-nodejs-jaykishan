import * as mysql from 'jm-ez-mysql';
import { Constants } from '../../config/constants';
import { ArticlesTable, Tables } from '../../config/tables';
import { ResponseBuilder } from '../../helpers/responseBuilder';
import moment = require('moment');

export class ArticleUtils {
  // Get all settings
  public async getAllArticles(skip: number, limit: number): Promise<ResponseBuilder> {
    const whereClause = '1=1';
    const whereClauseForCount = whereClause;
    const orderBy = `ORDER BY ${ArticlesTable.CREATED_AT} DESC`;
    const isLimit = `LIMIT ${(skip - 1) * limit}, ${limit}`;
    const totalRows = await mysql.first(
      Tables.ARTICLES,
      ['COUNT(DISTINCT id) as count'],
      whereClauseForCount
    );
    const articles = await mysql.findAll(
      Tables.ARTICLES,
      [
        ArticlesTable.ID,
        ArticlesTable.NICKNAME,
        ArticlesTable.TITLE,
        ArticlesTable.CONTENT,
        `DATE_FORMAT(${ArticlesTable.CREATED_AT}, '%D %b, %Y at %r') AS createdAt`,
      ],
      `${whereClause} ${orderBy} ${isLimit}`
    );
    return ResponseBuilder.data({ data: articles, totalRows: totalRows.count });
  }

  public async getArticleDetail(articleId: number): Promise<ResponseBuilder> {
    const articleDetail = await mysql.first(
      Tables.ARTICLES,
      [
        ArticlesTable.ID,
        ArticlesTable.NICKNAME,
        ArticlesTable.TITLE,
        ArticlesTable.CONTENT,
        `DATE_FORMAT(${ArticlesTable.CREATED_AT}, '%D %b, %Y at %r') AS createdAt`,
      ],
      `${ArticlesTable.ID} = ?`,
      [articleId]
    );
    return ResponseBuilder.data(articleDetail);
  }

  public async updateArticleDetail(articleId: number, article: any): Promise<ResponseBuilder> {
    const articleDetail = {
      title: article.title,
      content: article.content,
      updatedAt: moment().format(Constants.DATA_BASE_DATE_TIME_FORMAT),
    };
    const updateArticle = await mysql.update(
      Tables.ARTICLES,
      articleDetail,
      `${ArticlesTable.ID} = ${articleId}`
    );
    if (updateArticle.affectedRows > 0) {
      return ResponseBuilder.data({ updated: true });
    }
    return ResponseBuilder.data({ updated: false });
  }

  public async postArticle(articleDetail: any): Promise<ResponseBuilder> {
    const article = await mysql.insert(Tables.ARTICLES, articleDetail);

    if (article.insertId) {
      return ResponseBuilder.data({ insert: true });
    }
    return ResponseBuilder.data({ insert: false });
  }
}
