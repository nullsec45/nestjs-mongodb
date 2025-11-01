// import {Category} from '../schemas/i.schema';    
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    MinLength,
} from 'class-validator';


export class SignInDto{
   @IsNotEmpty()
   @IsEmail({},{message:'Please enter correct email.'})
   readonly email:string;

   @IsNotEmpty()
   @IsString()
   @MinLength(8)
   readonly password:string;
}