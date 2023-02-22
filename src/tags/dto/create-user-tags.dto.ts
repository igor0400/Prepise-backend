export class CreateUserTagsDto {
  readonly userId: number;
  readonly tags: string[] | string;
}
