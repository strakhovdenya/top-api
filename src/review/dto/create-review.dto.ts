import { IsString, IsNumber, Max, Min } from "class-validator";

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Max(5, { message: "Рейтинг не может быть более 5ти" })
  @Min(1, { message: "Рейтинг не может быть менее 1го" })
  @IsNumber()
  rating: number;

  @IsString()
  productId: string;
}
