import { Request, Response } from 'express';
import * as l10n from 'jm-ez-l10n';
import { Constants } from '../../config/constants';
import { ResponseBuilder } from '../../helpers/responseBuilder';
import { CommentUtils } from './commentUtils';
import { Log } from '../../helpers/logger';
import { hasIn } from 'lodash';

export class CommentController {
  private commentUtils: CommentUtils = new CommentUtils();
  private logger = Log.getLogger();

  // Get all comments of an article
  public getAllComments = async (req: any, res: Response) => {
    const { articleId } = req.params;
    const {
      skip = Constants.DEFAULT_PAGE,
      limit = Constants.DEFAULT_LIMIT,
      isSendAll = 1,
    } = req.query;
    const comment: ResponseBuilder = await this.commentUtils.getAllComments(
      articleId,
      skip,
      limit,
      +isSendAll
    );
    res.status(comment.code).json(comment.result);
  };

  // Post a comment
  public postComment = async (req: any, res: Response) => {
    const { articleId } = req.params;
    const commentId = hasIn(req.body, 'commentId') ? req.body.commentId : null;
    const commentDetail = req.body;
    delete commentDetail.commentId;
    const comment: ResponseBuilder = await this.commentUtils.postComment(
      articleId,
      commentId,
      commentDetail
    );
    comment.result.insert
      ? comment.result.isParent
        ? res.status(comment.code).json({ message: req.t('MSG_ON_COMMENT_ADDED') })
        : res.status(comment.code).json({ message: req.t('MSG_COMMENT_ADDED') })
      : res.status(Constants.FAIL_CODE).json({ error: req.t('ERR_ACTION_NOT_FOUND') });
  };
}
