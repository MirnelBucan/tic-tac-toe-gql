import {Field, InputType} from "type-graphql";
import {Length, Min} from "class-validator";
import {FilterInput} from "./FilterInput";


@InputType()
export class SearchUserInput extends FilterInput {
  @Field({nullable: true})
  @Min(1)
  userId?: number

  @Field({nullable: true})
  @Length(1,20)
  name?: string
}