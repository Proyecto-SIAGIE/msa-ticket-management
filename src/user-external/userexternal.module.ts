import { Module } from '@nestjs/common';
import { UserExternalImplService } from './application/service/userExternalImpl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserExternalEntity } from './domain/model/userExternal.entity';
import { UserExternalImplRepository } from './infrastructure/userExternalImpl.repository';
import { UserExternalController } from './infrastructure/controller/userExternal.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserExternalEntity])
    ],
    controllers: [UserExternalController],
    providers: [UserExternalImplService, UserExternalImplRepository],
})
export class UserExternalModule {}