import { IsNotEmpty, IsOptional } from 'class-validator';
import { Model } from '../../model';

export class ArticleModel extends Model {
  @IsNotEmpty()
  public nickname: string;

  @IsNotEmpty()
  public title: string;

  @IsNotEmpty()
  public content: string;

  constructor(body: any) {
    super();
    const { nickname, title, content } = body;
    this.nickname = nickname;
    this.title = title;
    this.content = content;
  }
}

export class UpdateArticleModel extends Model {
  @IsNotEmpty()
  @IsOptional()
  public title: string;

  @IsNotEmpty()
  @IsOptional()
  public content: string;

  constructor(body: any) {
    super();
    const { title, content } = body;
    this.title = title;
    this.content = content;
  }
}
