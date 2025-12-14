import {Test, TestingModule} from '@nestjs/testing';
import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';

describe('BookService',() => {
    let authService:AuthService;
    let authController:AuthController;;


    let jwtToken='jwtToken';

    const mockAuthController={
        signUp:jest.fn().mockResolvedValueOnce(jwtToken),
        signIn:jest.fn().mockResolvedValueOnce(jwtToken),
    };

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            controllers:[AuthController],
            providers:[
                {
                    provide: AuthService,
                    useValue:mockAuthController,
                }
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        authController = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('signUp',() => {
        it('should register a new user', async() => {
            const signUpDto={
                name:'halo',
                email:'halo@gmail.com',
                password:'hayamwuruk'
            };

            const result=await authController.signUp(signUpDto);
            expect(authService.signUp).toHaveBeenCalled();
            expect(result).toEqual(jwtToken);
        })
    })

   

    describe('login',() => {
        it('should login user', async() => {
              const loginDto = {
                email: 'ghulam1@gmail.com',
                password: '12345678',
            };

            const result = await authController.signIn(loginDto);
            expect(authService.signIn).toHaveBeenCalled();
            expect(result).toEqual(jwtToken);
        })
    });
});