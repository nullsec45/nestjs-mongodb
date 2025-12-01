import {Test, TestingModule} from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/user.schema';
// import { CreateBookDto } from './dto/create-book.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { sign } from 'crypto';

describe('BookService',() => {
    let authService:AuthService;
    let model:Model<User>; 
    let jwtService:JwtService
  

    const mockUser={
        _id:'690612d0a60580a8b3d82663',
        name: 'fajar',
        email: 'fajar@example.com',
    };

    let token='jwtToken';

    const mockAuthService={
        findOne:jest.fn(),
        create:jest.fn(),
    };

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                AuthService,
                JwtService,
                {
                    provide: getModelToken(User.name),
                    useValue:mockAuthService,
                }
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        model = module.get<Model<User>>(getModelToken(User.name));
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
        expect(model).toBeDefined();
    });

    describe('signUp',() => {
        const signUpDto={
            name:'Fajar Ganteng',
            email:'fajarganteng45@gmail.com',
            password:'fajarganteng',
        }

        it('should register the new user', async() => {
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
            // jest.spyOn(jwtService,'sign').mockReturnValueOnce('signed-token-mock');

            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve([mockUser] as any)); 


            jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

            const result=await authService.signUp(signUpDto);

            expect(bcrypt.hash).toHaveBeenCalled();
            expect(result).toEqual({token});
        });

        it('should throw duplicate email error', async() => {
            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.reject({code:11000} as any));

            await expect(authService.signUp(signUpDto)).rejects.toThrow(ConflictException);
        });
    })

   

    describe('signIn',() => {
        const loginDto={
            email:'fajarganteng45@gmail.com',
            password:'fajarganteng',
        } 

        it('should login user and return the token', async() => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);

            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);
            jest.spyOn(jwtService,'sign').mockReturnValueOnce(token);

            const result=await authService.signIn(loginDto);

            expect(result).toEqual({token});
        })

        it('should throw invalid email error', async() => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);

            expect(authService.signIn(loginDto)).rejects.toThrowError(
                UnauthorizedException
            );
        })
    });
});