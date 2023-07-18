
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TicketImplService } from 'src/ticket/application/service/ticketImpl.service';
import { TicketRequestDto } from 'src/ticket/application/dto/ticketReq.dto';


@ApiTags('tickets')
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketImplService) {}

    @Get(':id')
    async findOneTicketById(@Param('id',ParseIntPipe) id: number){
        return await this.ticketService.findTicketById(id);
    }

    @Post()
    async registerTicket(@Body() createTicket: TicketRequestDto){
        return await this.ticketService.registerTicket(createTicket);
    }

    @Get()
    async listAllTickets(){
        return await this.ticketService.listAllTickets();
    }


}