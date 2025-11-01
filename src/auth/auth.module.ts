import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import {JwtModule, JwtModuleOptions, JwtService} from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            inject:[ConfigService],
            useFactory: (config: ConfigService): JwtModuleOptions => {
                const raw = config.get<string>('JWT_EXPIRES', '1h'); // default opsional
                // Jika hanya angka (detik), ubah ke number. Jika ada satuan (m/h/d), biarkan string.
                const expiresIn =
                raw && /^\d+$/.test(raw) ? Number(raw) : (raw as any); // cast kecil agar lolos check TS

                return {
                    secret: config.getOrThrow<string>('JWT_SECRET'),
                    signOptions: {
                        expiresIn, // number atau string “ms-like”
                    },
                };
            },
        }),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports:[
        AuthService,
    ]
})
export class AuthModule {}
