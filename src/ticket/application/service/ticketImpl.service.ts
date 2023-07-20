import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { TicketService } from "src/ticket/domain/ticket.service";
import { TicketResponseDto } from "../dto/ticketRes.dto";
import { TicketImplRepository } from "src/ticket/infrastructure/ticketImpl.repository";
import { mapper } from "src/utils/mapping/mapper";
import { TicketEntity } from "src/ticket/domain/model/ticket.entity";
import { TicketRequestDto } from "../dto/ticketReq.dto";
import { ErrorManager } from "src/utils/errors/error.manager";
import { UserExternalEntity } from "src/user-external/domain/model/userExternal.entity";
import { UserExternalResponseDto } from "src/user-external/application/dto/userExternalRes.dto";
import { FileRequestDto } from "src/file/application/dto/fileReq.dto";
import { FileResponseDto } from "src/file/application/dto/fileRes.dto";
import { FileImplRepository } from "src/file/infrastructure/fileImpl.repository";
import { FileEntity } from "src/file/domain/model/file.entity";

@Injectable()
export class TicketImplService implements TicketService {
    constructor(private readonly ticketRepository: TicketImplRepository,
        private readonly fileRepository: FileImplRepository) { }
    
    async registerFileByTicketId(ticketId: number, file: FileRequestDto): Promise<FileResponseDto> {
        try{
            const fileEntity = mapper.map(file, FileRequestDto, FileEntity);
            const responseFile = await this.fileRepository.createFileByTicketId(ticketId, fileEntity);
           
            return mapper.map(responseFile, FileEntity, FileResponseDto);

        }catch(error){
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    
    async findFilesByTicketId(ticketId: number): Promise<FileResponseDto[]> {
        const responseFiles = await this.fileRepository.findFilesByTicketId(ticketId);

        const files = responseFiles.map(responseFile =>
            mapper.map(responseFile, FileEntity, FileResponseDto)
        );

        return files;
    }
    
    async registerFileByNoteId(noteId: number, file: FileRequestDto): Promise<FileResponseDto> {
        throw new Error("Method not implemented.");
    }

    async registerTicket(ticket: TicketRequestDto): Promise<TicketResponseDto> {
        try {
            const ticketEntity = mapper.map(ticket, TicketRequestDto, TicketEntity);
            const responseTicket = await this.ticketRepository.createTicket(ticketEntity);

            return mapper.map(responseTicket, TicketEntity, TicketResponseDto);

        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }

    async findTicketById(id: number): Promise<TicketResponseDto> {
        try {
            const responseTicket = await this.ticketRepository.findTicketById(id);
            if (!responseTicket) {
                throw new ErrorManager({
                    type: 'NOT_FOUND',
                    message: `Ticket with ID ${id} not found`
                })
            }
            const ticket = mapper.map(responseTicket, TicketEntity, TicketResponseDto);
            ticket.userExternalId = responseTicket.userExternal.id;
            return ticket;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }

    async listAllTickets(): Promise<TicketResponseDto[]> {
        const responseTickets = await this.ticketRepository.listAllTickets();

        const tickets = responseTickets.map(responseTicket =>
            mapper.map(responseTicket, TicketEntity, TicketResponseDto)
        );

        return tickets;
    }

}