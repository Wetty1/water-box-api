import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionProvider } from './database/conection.provider';
import { Action } from './entities/action.entity';
import { Moviment } from './entities/moviment.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { config } from 'dotenv';
import { MailService } from './utils/mail/mail.service';

config();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppModule],
      inject: [ConnectionProvider],
      useFactory: (connectionProvider: ConnectionProvider) => connectionProvider.getConnection(),
    }),
    TypeOrmModule.forFeature([Moviment, Action]),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: '"Caixa dagua" <caixa@dagua.com>',
      },
    }),

  ],
  controllers: [AppController],
  providers: [AppService, ConnectionProvider, MailService],
  exports: [ConnectionProvider]
})
export class AppModule { }
