import * as mysql from 'jm-ez-mysql';
import { ArticlesTable, CommentsTable, Tables } from '../../config/tables';
import { ResponseBuilder } from '../../helpers/responseBuilder';
import { Utils } from '../../helpers/utils';
import { isEmpty } from 'lodash';

export class CommentUtils {
  // Get all comments of an article
  public async getAllComments(articleId: number, skip: number, limit: number, isSendAll: number) {
    const whereClause = `c1.${CommentsTable.ARTICLE_ID} = ${articleId}
      AND c1.${CommentsTable.PARENT_ID} IS NULL
      GROUP BY c1.${CommentsTable.ID}
      ORDER BY c1.${CommentsTable.CREATED_AT} ASC`;

    const whereClauseForCount = whereClause;

    let isLimit = ``;
    if (!isSendAll) {
      isLimit = `LIMIT ${(skip - 1) * limit}, ${limit}`;
    }

    const totalRows = await mysql.first(
      Tables.COMMENTS,
      ['COUNT(DISTINCT id) as count'],
      `${CommentsTable.PARENT_ID} IS NULL`
    );
    const comments = await mysql.findAll(
      `${Tables.COMMENTS} as c1
      LEFT JOIN ${Tables.COMMENTS} c2 ON c2.${CommentsTable.PARENT_ID} = c1.${CommentsTable.ID}`,
      [
        `c1.${CommentsTable.ID} AS commentId`,
        `c1.${CommentsTable.NICKNAME}`,
        `c1.${CommentsTable.CONTENT}`,
        `DATE_FORMAT(c1.${CommentsTable.CREATED_AT}, '%D %b, %Y at %r') AS createdAt`,
        `CONCAT('[',
             IF(c2.${CommentsTable.PARENT_ID} IS NOT NULL,
              GROUP_CONCAT(DISTINCT
              JSON_OBJECT(
                'id', c2.${CommentsTable.ID},
                'name', c2.${CommentsTable.NICKNAME},
                'content', c2.${CommentsTable.CONTENT},
                'createdAt', DATE_FORMAT(c2.${CommentsTable.CREATED_AT}, '%D %b, %Y at %r')
            )),''),
            ']') AS subComment`,
      ],
      `${whereClause} ${isLimit}`
    );

    comments.map((comment) => {
      comment.subComment = !isEmpty(comment.subComment)
        ? Utils.formatStringObjectsToArrayObjects(comment, 'subComment')
        : null;
    });
    return ResponseBuilder.data({ data: comments, totalRows: totalRows.count });
  }

  // Post a comment
  public async postComment(
    articleId: number,
    commentId: number,
    commentDetail: any
  ): Promise<ResponseBuilder> {
    const getArticle = await mysql.first(
      Tables.ARTICLES,
      [ArticlesTable.ID],
      `${ArticlesTable.ID} = ${articleId}`
    );
    let comment;
    if (getArticle && commentId) {
      commentDetail.articleId = articleId;
      commentDetail.parent = commentId;
      comment = await mysql.insert(Tables.COMMENTS, commentDetail);
    } else {
      commentDetail.articleId = articleId;
      comment = await mysql.insert(Tables.COMMENTS, commentDetail);
    }

    if (comment.insertId) {
      return ResponseBuilder.data({ insert: true });
    }
    return ResponseBuilder.data({ insert: false });
  }
}
