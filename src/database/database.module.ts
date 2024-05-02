import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('POSTGRES_HOST'),
                port: configService.get('POSTGRES_PORT'),
                password: configService.get('POSTGRES_PASSWORD'),
                username: configService.get('POSTGRES_USER'),
                entities: [__dirname+'/../**/*.entity.{js,ts}'],
                database: configService.get('POSTGRES_DB'),
                synchronize: true,
            }),
        }),
    ],
})


export class DatabaseModule {}

