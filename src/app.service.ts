import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm'
import { Action } from './entities/action.entity';
import { Moviment } from './entities/moviment.entity';
import { MailService } from './utils/mail/mail.service';
import { config } from 'dotenv';

config()

@Injectable()
export class AppService {
  private emailsToSend: string[];

  constructor(
    @InjectRepository(Moviment)
    private readonly movimentRepository: Repository<Moviment>,
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
    private readonly mailService: MailService
  ) {
    this.emailsToSend = process.env.EMAILS_TO.split(';');
  }

  async getState() {
    const res = await this.actionRepository.findOne({ where: {}, order: { createdat: 'DESC' } })
    const teste = await this.movimentRepository.findOne({ where: {}, order: { createdat: 'DESC' } })
    console.log(res);
    console.log(teste)
    if (!res) return 2
    switch (res.action) {
      case "desligar motor":
        return 0;
      case "ligar motor":
        return 1;
      case "resposta do modulo rele": //modulo de rele que vai chamar
        return 2;
    }
  }

  async registerAction(data: { sinal: number, liters?: number }) {
    const { sinal, liters } = data;

    let action: string;
    switch (sinal) {
      case 0:
        action = "desligar motor";
        break;
      case 1:
        action = "ligar motor";
        break;
      case 2: //modulo de rele que vai chamar
        action = "resposta do modulo rele";
        break;
    }
    const savedAction = await this.actionRepository.save({
      action,
      createdat: new Date(),
    })
    if (sinal === 2) return;

    await this.mailService.sendEmail(this.emailsToSend, 'Alerta do motor', action);

    const lastTurnOffMoviment = await this.movimentRepository.findOne({ where: { currentliterage: MoreThan(1100) }, order: { createdat: 'DESC' } })
    await this.movimentRepository.save({
      currentliterage: liters,
      actionid: savedAction.id,
      usedliterage: sinal === 1 ? lastTurnOffMoviment.currentliterage - liters : null,
      createdat: new Date(),
    })
  }
}
