import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query  } from 'express-serve-static-core';
// import { User } from 'src/auth/schemas/user.schema';
import { User } from "../auth/schemas/user.schema";


@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>,
    ){

    }

    async findAll(
        query:Query
    ):Promise<Book[]>{
        const resPerPage=2;
        const currentPage=Number(query.page) || 1;
        const skip=resPerPage * (currentPage - 1)

        const keyword=query.keyword ? {
            title:{
                $regex:query.keyword,
                $options:'i',
            }
        } : {};

        const books=await this.bookModel.find({...keyword}).limit(resPerPage).skip(skip);
        return books;
    }

    async create(
        book:CreateBookDto,
        user:User
    ):Promise<Book>{
        const data=Object.assign(book,{user:user._id})
        const result=await this.bookModel.create(book);
        return result;
    }

    async findById(id:string):Promise<Book>{
        const isValid=mongoose.isValidObjectId(id);

        if(!isValid){
            throw new BadRequestException('Please enter correct id.')
        }
        
        const book=await this.bookModel.findById(id);

        if(!book){
            throw new NotFoundException('Book not found');
        }
        return book;
    }

    async updateById(
        id:string,
        book:UpdateBookDto,
        user:User
    ):Promise<Book>{   
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
