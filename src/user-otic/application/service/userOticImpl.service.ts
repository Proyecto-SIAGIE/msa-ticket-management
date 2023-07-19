/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { UserOticService } from 'src/user-otic/domain/userOtic.service';
import { UserOticRequestDto } from '../dto/userOticReq.dto';
import { UserOticResponseDto } from '../dto/userOticRes.dto';
import { UserOticImplRepository } from 'src/user-otic/infrastructure/userOticImpl.repository';
import { mapper } from 'src/utils/mapping/mapper';
import { UserOticEntity } from 'src/user-otic/domain/model/userOtic.entity';
import { ErrorManager } from 'src/utils/errors/error.manager';

@Injectable()
export class UserOticImplService implements UserOticService {
    constructor(private readonly userRepository: UserOticImplRepository){}
    
    async registerUserOtic(user: UserOticRequestDto): Promise<UserOticResponseDto> {
        try {
            const userEntity = mapper.map(user, UserOticRequestDto, UserOticEntity);
            const responseUser = await this.userRepository.createUserOtic(userEntity);

            return mapper.map(responseUser, UserOticEntity, UserOticResponseDto);

        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    
    async updateUserOticById(id: number, userRequest: UserOticRequestDto): Promise<UserOticResponseDto> {
        try {
            const userEntity = mapper.map(userRequest, UserOticRequestDto, UserOticEntity);
            const responseUser = await this.userRepository.updateUserOticById(id, userEntity);
            if (!responseUser) {
                throw new ErrorManager({
                    type: 'NOT_FOUND',
                    message: `User-Otic with Id ${id} not found`
                })
            }
            return mapper.map(responseUser, UserOticEntity, UserOticResponseDto);

        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    
    async deleteUserOticById(id: number): Promise<UserOticResponseDto> {
        try {
            const responseUser = await this.userRepository.deleteUserOticById(id);
            if (!responseUser) {
                throw new ErrorManager({
                    type: 'NOT_FOUND',
                    message: `User-Otic with Id ${id} not found`
                })
            }
            const user = mapper.map(responseUser, UserOticEntity, UserOticResponseDto);
            return user;

        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    
    async findUserOticById(id: number): Promise<UserOticResponseDto> {
        try {
            const responseUser = await this.userRepository.findUserOticById(id);
            if (!responseUser) {
                throw new ErrorManager({
                    type: 'NOT_FOUND',
                    message: `User-Otic with Id ${id} not found`
                })
            }
            const user = mapper.map(responseUser, UserOticEntity, UserOticResponseDto);
            return user;

        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    
    async listAllUserOtics(): Promise<UserOticResponseDto[]> {
        const responseUsers = await this.userRepository.listAllUserOtics();

        const users = responseUsers.map(responseUser =>
            mapper.map(responseUser, UserOticEntity, UserOticResponseDto)
        );

        return users;
    }
}
