
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TicketImplService } from 'src/ticket/application/service/ticketImpl.service';
import { TicketRequestDto } from 'src/ticket/application/dto/ticketReq.dto';
import { FileRequestDto } from 'src/file/application/dto/fileReq.dto';
import { NoteRequestDto } from 'src/notes/application/dto/noteReq.dto';


@ApiTags('tickets')
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketImplService) {}

    @Get(':id')
    async findOneTicketById(@Param('id',ParseIntPipe) id: number){
        return await this.ticketService.findTicketById(id);
    }

    /*@Post()
    async registerTicket(@Body() createTicket: TicketRequestDto){
        return await this.ticketService.registerTicket(createTicket);
    }*/

    @Post(':id/files')
    async registerFileByTicketId(@Param('id',ParseIntPipe) id: number, @Body() createFile: FileRequestDto){
        return await this.ticketService.registerFileByTicketId(id,createFile);
    }

    @Post(':id/notes')
    async registeNoteByTicketId(@Param('id',ParseIntPipe) id: number, @Body() createNote: NoteRequestDto){
        return await this.ticketService.registerNoteByTicketId(id,createNote);
    }

    @Get(':id/files')
    async listFilesByTicketId(@Param('id',ParseIntPipe) id: number){
        return await this.ticketService.findFilesByTicketId(id);
    }

    @Get(':id/notes')
    async listNotesByTicketId(@Param('id',ParseIntPipe) id: number){
        return await this.ticketService.findNotesByTicketId(id);
    }

    @Get()
    async listAllTickets(){
        return await this.ticketService.listAllTickets();
    }


}