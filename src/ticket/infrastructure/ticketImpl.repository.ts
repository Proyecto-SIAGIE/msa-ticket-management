import { Injectable } from "@nestjs/common";
import { TicketEntity } from "../domain/model/ticket.entity";
import { TicketRepository } from "../domain/ticket.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


@Injectable()
export class TicketImplRepository implements TicketRepository {
    constructor(
        @InjectRepository(TicketEntity)
        private readonly ticketOrmRepository: Repository<TicketEntity>,) { }

    async createTicket(ticket: TicketEntity): Promise<TicketEntity> {

        const ticketPreload = this.ticketOrmRepository.create(ticket);
        const resultTicket = await this.ticketOrmRepository.save(ticketPreload);
        return resultTicket;
    }

    async findTicketById(id: number): Promise<TicketEntity> {
        const ticket = this.ticketOrmRepository.findOneBy({ id: id });
        return ticket;
    }

    async listAllTickets(): Promise<TicketEntity[]> {
        const tickets = this.ticketOrmRepository.find();
        return tickets;
    }

}