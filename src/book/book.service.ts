import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>,
    ){

    }

    async findAll():Promise<Book[]>{
        const books=await this.bookModel.find().exec();
        return books;
    }

    async create(book:CreateBookDto):Promise<Book>{
        const result=await this.bookModel.create(book);
        return result;
    }

    async findById(id:string):Promise<Book>{
        const book=await this.bookModel.findById(id);

        if(!book){
            throw new Error('Book not found');
        }
        return book;
    }

    async updateById(id:string, book:UpdateBookDto):Promise<Book>{   
        const checkBook=await this.bookModel.findById(id);

        if(!checkBook){
            throw new Error('Book not found');
        }

        return await this.bookModel.findByIdAndUpdate(id, book, {new:true});
    }

    async deleteById(id:string):Promise<Book>{
        const checkBook=await this.bookModel.findById(id);

        if(!checkBook){
            throw new Error('Book not found');
        }
        
        return await this.bookModel.findByIdAndDelete(id);
    }
}
