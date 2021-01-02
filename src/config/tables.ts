export class Tables {
  public static readonly ARTICLES = 'articles';
  public static readonly COMMENTS = 'comments';
}

// Articles table's fields
export enum ArticlesTable {
  ID = 'id',
  TITLE = 'title',
  NICKNAME = 'nickname',
  CONTENT = 'content',
  CREATED_AT = 'createdAt'
}

// Comments table's fields
export enum CommentsTable {
  ID = 'id',
  ARTICLE_ID = 'articleId',
  PARENT_ID = 'parent',
  NICKNAME = 'nickname',
  CONTENT = 'content',
  CREATED_AT = 'createdAt'
}
