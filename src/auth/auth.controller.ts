import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService
    ){
    }

    @Post('sign-up')
    async signUp(@Body() signUpDto:SignUpDto):Promise<{token:string}>{
        return this.authService.signUp(signUpDto);
    }

    @Post('login')
    async signIn(@Body() signInDto:SignInDto):Promise<{token:string}>{
        return this.authService.signIn(signInDto);
    }
}
