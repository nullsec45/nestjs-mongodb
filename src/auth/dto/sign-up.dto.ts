// import {Category} from '../schemas/i.schema';    
import {
    IsNotEmpty,
    IsString,
    MinLength,
    IsEmail
} from 'class-validator';


export class SignUpDto{
   @IsNotEmpty()
   @IsString()
   readonly name:string;

   @IsNotEmpty()
   @IsEmail({},{message:'Please enter correct email.'})
   readonly email:string;

   @IsNotEmpty()
   @IsString()
   @MinLength(8)
   readonly password:string;
}