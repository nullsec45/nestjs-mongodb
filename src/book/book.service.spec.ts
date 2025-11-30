import {Test, TestingModule} from '@nestjs/testing';
import {BookService} from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book, Category } from './schemas/book.schema';
import mongoose, { Model } from 'mongoose';
import { mock } from 'node:test';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/schemas/user.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { create } from 'domain';

describe('BookService',() => {
    let bookService:BookService;
    let model:Model<Book>; 
    
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
        find:jest.fn(),
        create:jest.fn(),
        findById:jest.fn()
    };

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                BookService,
                {
                    provide: getModelToken(Book.name),
                    useValue:mockBookService,
                }
            ],
        }).compile();

        bookService = module.get<BookService>(BookService);
        model = module.get<Model<Book>>(getModelToken(Book.name));
    });

    describe('create',() => {
        it('should create and return a book', async() => {
            const newBook={
                title: 'Negeri Para Bedebah',
                description: 'BOok Description',
                author: 'Tere Liye',
                price: 850000,
                category: Category.ADVENTURE,
            }

            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(newBook  as any));

            const result=await bookService.create(newBook as CreateBookDto, mockUser as User);

            // console.log(result);

            

            expect(newBookMock).toEqual(result);
        })
    });

    describe('findAll',() => {
        it('should return an array of books', async() => {
            const query={page:'1', keyword:'New'};

            jest.spyOn(model, 'find').mockImplementation(
                () => ({
                    limit: () => ({
                        skip:jest.fn().mockResolvedValue([mockBook]),
                    }),
                } as any),
            );

            const result=await bookService.findAll(query);
            expect(model.find).toHaveBeenCalledWith({
                title:{$regex:'New',$options:'i'},
            });

            expect([mockBook]).toEqual(result);
        })
    });


    describe('findById',() => {
        it('should find and return a book by ID', async () => {
            jest.spyOn(model,'findById').mockResolvedValue(mockBook);

            const result=await bookService.findById(mockBook._id);

            expect(model.findById).toHaveBeenCalledWith(mockBook._id);
            expect(result).toEqual(mockBook);
        });

        it('should throw BadRequestException if invalid ID is provided', async() => {
            const id='invalid-id';

            const isValidObjectIDMock=jest.spyOn(mongoose,'isValidObjectId').mockReturnValue(false);

            await expect(bookService.findById(id)).rejects.toThrow(BadRequestException);

            expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
            isValidObjectIDMock.mockRestore();
        });

        it('should throw NotFoundException if book is not found', async() => {
            jest.spyOn(model, 'findById').mockResolvedValue(null);

            await expect(bookService.findById(mockBook._id)).rejects.toThrow(
                NotFoundException
            );

            expect(model.findById).toHaveBeenCalledWith(mockBook._id);
        });
    });
});