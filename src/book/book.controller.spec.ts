import {Test, TestingModule} from '@nestjs/testing';
import {BookController} from './book.controller';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book, Category } from './schemas/book.schema';
import mongoose, { Model } from 'mongoose';
import { mock } from 'node:test';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/schemas/user.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { create } from 'domain';
import { find } from 'rxjs';
import { PassportModule } from '@nestjs/passport';
import { UpdateBookDto } from './dto/update-book.dto';


describe('BookController',() => {
    let bookController:BookController;
    let bookService:BookService;

    
    const mockBook={
        _id: '690c3c84807ee1cc7e100595',
        title: 'New Book',
        description: 'Bla bla bla',
        author: 'Fajar',
        price: 90000,
        category: Category.ADVENTURE,
    }

    const newBookMock={
        title: 'Negeri Para Bedebah',
        description: 'BOok Description',
        author: 'Tere Liye',
        price: 850000,
        category: Category.ADVENTURE,
        user:'690612d0a60580a8b3d82663'
    };

    const mockUser={
        _id:'690612d0a60580a8b3d82663',
        name: 'fajar',
        email: 'fajar@example.com',
    };

    const mockBookService={
        findAll:jest.fn().mockResolvedValueOnce([mockBook]),
        create:jest.fn(),
        findById:jest.fn().mockResolvedValueOnce(mockBook),
        updateById:jest.fn(),
        deleteById:jest.fn().mockResolvedValueOnce({deleted:true}),
    };

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            imports:[PassportModule.register({defaultStrategy:'jwt'})],          
            controllers:[BookController],
            providers:[
                {
                    provide: BookService,
                    useValue:mockBookService,
                }
            ],
        }).compile();

        bookService = module.get<BookService>(BookService);
        bookController=module.get<BookController>(BookController);

    });

    it('should be defined', () => {
      expect(bookController).toBeDefined();
    });

    describe('get all books',() => {
        it('should get all books', async() => {
           const result=await bookController.getAllBooks({
              page:'1',
              keyword:'test',
           });


           expect(bookService.findAll).toHaveBeenCalled();
           expect(result).toEqual([mockBook]);
        });
    });
    

    describe('create book',() => {
        it('should create a new book', async() => {
            const newBook={
                title: 'Negeri Para Bedebah',
                description: 'Book Description',
                author: 'Tere Liye',
                price: 850000,
                category: Category.ADVENTURE,
            }

            mockBookService.create=jest.fn().mockResolvedValueOnce(mockBook);

            const result = await bookController.createBook(
                newBook as CreateBookDto,
                mockUser as User,
            );

            expect(bookService.create).toHaveBeenCalled();
            expect(result).toEqual(mockBook);
        });
    });


    describe('get book by id',() => {
        it('should get a book by ID', async () => {
            const result=await bookController.getBook(mockBook._id);

            expect(bookService.findById).toHaveBeenCalledWith(mockBook._id);
            expect(result).toEqual(mockBook);
        });
    });


    describe('update book', () => {
        it('should update book by its ID', async () => {
            const updatedBook = { ...mockBook, title: 'Updated name' };
            const book = { title: 'Updated name' };

            mockBookService.updateById=jest.fn().mockResolvedValueOnce(updatedBook);

            const result=await bookController.updateBook(
              mockBook._id,
              book as UpdateBookDto,
            );


            expect(bookService.updateById).toHaveBeenCalled();
            expect(result.title).toEqual(book.title);
        });
    });


    describe('delete book', () => {
        it('should delete a book by  ID', async () => {
            const result=await bookController.deleteBook(mockBook._id);

            expect(bookService.deleteById).toHaveBeenCalled();
            expect(result).toEqual({deleted:true});
        });
    });
});