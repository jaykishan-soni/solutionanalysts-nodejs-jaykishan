import { IsNotEmpty } from 'class-validator';
import { Model } from '../../model';

export class CommentModel extends Model {
  @IsNotEmpty()
  public nickname: string;

  @IsNotEmpty()
  public content: string;

  constructor(body: any) {
    super();
    const { nickname, content } = body;
    this.nickname = nickname;
    this.content = content;
  }
}
