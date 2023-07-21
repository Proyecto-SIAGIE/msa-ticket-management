import { Module } from '@nestjs/common';
import { UserExternalImplService } from './application/service/userExternalImpl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserExternalEntity } from './domain/model/userExternal.entity';
import { UserExternalImplRepository } from './infrastructure/userExternalImpl.repository';
import { UserExternalController } from './infrastructure/controller/userExternal.controller';
import { RoleEntity } from '../role/domain/model/role.entity';
import { TicketEntity } from '../ticket/domain/model/ticket.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([UserExternalEntity]),
        TypeOrmModule.forFeature([RoleEntity]),
        TypeOrmModule.forFeature([TicketEntity])
    ],
    controllers: [UserExternalController],
    providers: [UserExternalImplService, UserExternalImplRepository],
})
export class UserExternalModule {}