import {Field, InputType} from "type-graphql";
import {IsInt, Min} from "class-validator";

@InputType()
export class FilterInput {

  @Field({nullable: true})
  @Min(0)
  @IsInt()
  first?: number

  @Field({nullable: true})
  @Min(0)
  @IsInt()
  skip?: number

}