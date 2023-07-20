/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { NoteService } from 'src/notes/domain/note.service';
import { NoteRequestDto } from '../dto/noteReq.dto';
import { NoteResponseDto } from '../dto/noteRes.dto';
import { NoteImplRepository } from 'src/notes/infrastructure/noteImpl.repository';
import { mapper } from 'src/utils/mapping/mapper';
import { NoteEntity } from 'src/notes/domain/model/note.entity';
import { ErrorManager } from 'src/utils/errors/error.manager';
import { FileRequestDto } from 'src/file/application/dto/fileReq.dto';
import { FileResponseDto } from 'src/file/application/dto/fileRes.dto';
import { FileEntity } from 'src/file/domain/model/file.entity';
import { FileImplRepository } from 'src/file/infrastructure/fileImpl.repository';

@Injectable()
export class NoteImplService implements NoteService {
    constructor(private readonly noteRepository: NoteImplRepository,
        private readonly fileRepository: FileImplRepository){}
    
    async findFilesByNoteId(noteId: number): Promise<FileResponseDto[]> {
        const responseFiles = await this.fileRepository.findFilesByNoteId(noteId);

        const files = responseFiles.map(responseFile =>
            mapper.map(responseFile, FileEntity, FileResponseDto)
        );

        return files;
    }
    
    async registerFileByNoteId(noteId: number, file: FileRequestDto): Promise<FileResponseDto> {
        try{
            const fileEntity = mapper.map(file, FileRequestDto, FileEntity);
            const responseFile = await this.fileRepository.createFileByNoteId(noteId, fileEntity);
           
            return mapper.map(responseFile, FileEntity, FileResponseDto);

        }catch(error){
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    
    /*async registerNoteByTicketId(ticketId: number, note: NoteRequestDto): Promise<NoteResponseDto> {
        
    }*/

    async updateNoteById(id: number, noteUpdate: NoteRequestDto): Promise<NoteResponseDto> {
        try{
            const noteEntity = mapper.map(noteUpdate, NoteRequestDto, NoteEntity);
            const responseNote = await this.noteRepository.updateNoteById(id, noteEntity);
            if (!responseNote) {
                throw new ErrorManager({
                    type: 'NOT_FOUND',
                    message: `Note with Id ${id} not found`
                })
            }
            return mapper.map(responseNote, NoteEntity, NoteResponseDto);
        }catch(error){
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    
    async deleteNoteById(id: number): Promise<NoteResponseDto> {
        try {
            const responseNote = await this.noteRepository.deleteNoteById(id);
            if (!responseNote) {
                throw new ErrorManager({
                    type: 'NOT_FOUND',
                    message: `Note with Id ${id} not found`
                })
            }
            const note = mapper.map(responseNote, NoteEntity, NoteResponseDto);
            return note;

        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    
    async findNoteById(id: number): Promise<NoteResponseDto> {
        try {
            const responseNote = await this.noteRepository.findNoteById(id);
            if (!responseNote) {
                throw new ErrorManager({
                    type: 'NOT_FOUND',
                    message: `File with Id ${id} not found`
                })
            }
            const note = mapper.map(responseNote, NoteEntity, NoteResponseDto);
            note.ticketId = responseNote.ticket.id;
            return note;

        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    
    async listAllNotes(): Promise<NoteResponseDto[]> {
        const responseNotes = await this.noteRepository.listAllNotes();

        const notes = responseNotes.map(responseNote =>
            mapper.map(responseNote, NoteEntity, NoteResponseDto)
        );

        return notes;
    }

}
