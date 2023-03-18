import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { config } from 'dotenv'
import { Action } from "../entities/action.entity";
import { Moviment } from "../entities/moviment.entity";
config()

@Injectable()
export class ConnectionProvider {
    private connection_data = {
        host: null,
        user: null,
        pass: null,
        base: null,
        port: null,
    };
    constructor() {
        const { DB_HOST, DB_USER, DB_PASS, DB_BASE, DB_PORT } = process.env;
        this.connection_data = {
            host: DB_HOST,
            user: DB_USER,
            pass: DB_PASS,
            base: DB_BASE,
            port: DB_PORT,
        }
    }

    getConnection(): TypeOrmModuleOptions {
        return {
            host: this.connection_data.host,
            password: this.connection_data.pass,
            database: this.connection_data.base,
            username: this.connection_data.user,
            port: this.connection_data.port,
            entities: [Moviment, Action],
            logging: true,
            type: "postgres"
        }
    }
} 