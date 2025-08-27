import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeModule } from './application/attribute/attribute.module';
import { CategoryModule } from './application/category/category.module';
import { GameModule } from './application/game/game.module';
import { MoveModule } from './application/move/move.module';
import { PersonModule } from './application/person/person.module';
import { UserModule } from './application/user/user.module';
import { AuthModule } from './application/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'tic_tac_toe_quiz',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MoveModule, 
    UserModule, 
    GameModule, 
    AttributeModule, 
    PersonModule, 
    CategoryModule,
    AuthModule,
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
