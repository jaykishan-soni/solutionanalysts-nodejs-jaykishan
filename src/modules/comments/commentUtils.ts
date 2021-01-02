import * as mysql from 'jm-ez-mysql';
import { ArticlesTable, CommentsTable, Tables } from '../../config/tables';
import { ResponseBuilder } from '../../helpers/responseBuilder';
import { Utils } from '../../helpers/utils';
import { isEmpty } from 'lodash';

import * as amqplib from 'amqplib';

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
      `${CommentsTable.ARTICLE_ID} = ${articleId}
        AND ${CommentsTable.PARENT_ID} IS NULL`
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
    let isParent = false;
    if (getArticle && commentId) {
      isParent = true;
      commentDetail.articleId = articleId;
      commentDetail.parent = commentId;
    } else {
      commentDetail.articleId = articleId;
    }
    const sendMessangeInQueue = await this.sendMessageQueue(commentDetail);
    if (sendMessangeInQueue) {
      await this.getFromMessageQueue();
    } else {
      await this.addInCommentDB(commentDetail);
    }
    return ResponseBuilder.data({ insert: true, isParent });
  }

  public async sendMessageQueue(commentDetail) {
    try {
      const q = 'comment';
      const conn = await amqplib.connect('amqp://localhost');
      const ch = await conn.createChannel();
      await ch.assertQueue(q);
      const qm = JSON.stringify({
        articleId: commentDetail.articleId,
        nickname: commentDetail.nickname,
        content: commentDetail.content,
        parent: commentDetail.parent,
      });
      await ch.sendToQueue(q, Buffer.from(qm, 'utf8'));
      return true;
    } catch (error) {
      console.log(error.cause.code);
      return false;
    }
  }

  public async getFromMessageQueue() {
    try {
      const q = 'comment';
      const conn = await amqplib.connect('amqp://localhost');
      const ch = await conn.createChannel();
      await ch.assertQueue(q).then(() =>
        ch.consume(q, async (msg) => {
          if (msg !== null) {
            console.log(`Got message ${msg.content.toString()}`);
            const qm = JSON.parse(msg.content.toString());
            const queueData = {
              articleId: qm.articleId,
              parent: qm.parent,
              nickname: qm.nickname,
              content: qm.content,
            };
            await this.addInCommentDB(queueData).then(() => ch.ack(msg));
          }
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async addInCommentDB(queueData) {
    return await mysql.insert(Tables.COMMENTS, queueData);
  }
}
