export class CreateQuestionTagsDto {
  readonly questionId: string;
  readonly tags: string[] | string;
}
