export interface CreateMemoDto {
  title: string;
  text: string;
}

export interface UpdateMemoDto {
  title?: string;
  text?: string;
}
