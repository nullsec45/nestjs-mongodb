import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose from "mongoose";
// import { User } from "src/auth/schemas/user.schema";
import { User } from "../../auth/schemas/user.schema";


export enum Category {
    ADVENTURE = 'Adventure',
    ROMANCE = 'Romance',
    HORROR = 'Horror',
    CLASSICS='Classics',
    FANTASY='Fantasy',
}

@Schema({
    timestamps: true,
})
export class Book {
    @Prop({required: true})
    title: string;

    @Prop({required: true})
    description: string;
    
    @Prop({required: true})
    author:string;
    
    @Prop()
    price:number

    @Prop()
    category: Category;

    @Prop({type:mongoose.Schema.Types.ObjectId, ref:'User'})
    user:User
}

export const BookSchema = SchemaFactory.createForClass(Book);