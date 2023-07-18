/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserExternalService } from 'src/user-external/domain/userExternal.service';
import { UserExternalImplRepository } from 'src/user-external/infrastructure/userExternalImpl.repository';
import { UserExternalRequestDto } from '../dto/userExternalReq.dto';
import { UserExternalResponseDto } from '../dto/userExternalRes.dto';
import { mapper } from 'src/utils/mapping/mapper';
import { UserExternalEntity } from 'src/user-external/domain/model/userExternal.entity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ErrorManager } from 'src/utils/errors/error.manager';

@Injectable()
export class UserExternalImplService implements UserExternalService {
    constructor(private readonly userRepository: UserExternalImplRepository) { }

    async registerUserExternal(user: UserExternalRequestDto): Promise<UserExternalResponseDto> {
        try {
            const userEntity = mapper.map(user, UserExternalRequestDto, UserExternalEntity);
            const responseUser = await this.userRepository.createUserExternal(userEntity);

            return mapper.map(responseUser, UserExternalEntity, UserExternalResponseDto);

        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }

    async updateUserExternalById(id: number, userRequest: UserExternalRequestDto): Promise<UserExternalResponseDto> {
        try {
            const userEntity = mapper.map(userRequest, UserExternalRequestDto, UserExternalEntity);
            const responseUser = await this.userRepository.updateUserExternalById(id, userEntity);
            if (!responseUser) {
                throw new ErrorManager({
                    type: 'NOT_FOUND',
                    message: `User-External with Id ${id} not found`
                })
            }
            return mapper.map(responseUser, UserExternalEntity, UserExternalResponseDto);

        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }

    async deleteUserExtenalById(id: number): Promise<UserExternalResponseDto> {
        try {
            const responseUser = await this.userRepository.deleteUserExtenalById(id);
            if (!responseUser) {
                throw new ErrorManager({
                    type: 'NOT_FOUND',
                    message: `User-External with Id ${id} not found`
                })
            }
            const user = mapper.map(responseUser, UserExternalEntity, UserExternalResponseDto);
            return user;

        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }

    async findUserExternalById(id: number): Promise<UserExternalResponseDto> {
        try {
            const responseUser = await this.userRepository.findUserExternalById(id);
            if (!responseUser) {
                throw new ErrorManager({
                    type: 'NOT_FOUND',
                    message: `User-External with Id ${id} not found`
                })
            }
            const user = mapper.map(responseUser, UserExternalEntity, UserExternalResponseDto);
            return user;

        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }

    }



    async listAllUserExternals(): Promise<UserExternalResponseDto[]> {
        const responseUsers = await this.userRepository.listAllUserExternals();

        const users = responseUsers.map(responseUser =>
            mapper.map(responseUser, UserExternalEntity, UserExternalResponseDto)
        );

        return users;
    }


}
