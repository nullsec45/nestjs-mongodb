import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export enum Category {
    ADVENTURE = 'ADVENTURE',
    ROMANCE = 'ROMANCE',
    HORROR = 'HORROR',
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
}

export const BookSchema = SchemaFactory.createForClass(Book);