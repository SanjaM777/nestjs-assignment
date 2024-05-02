import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Auth } from "./entities/auth.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(Auth)
        private usersRepository: Repository<Auth>,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiraton: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload){
        const  { id } = payload;

        const user =  await this.usersRepository.findOneBy({id});
        if(!user){
            throw new UnauthorizedException('Login first to access this endpoint');
        }
        return user;
    }
}