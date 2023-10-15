import { forwardRef, Module } from '@nestjs/common';
import { ClassRangeService } from './classRange.service.js';
import { ClassRangeController } from './classRange.controller.js';
import { UserModule } from '../user/user.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassRange } from '../entities/ClassRange.js';

@Module({
    providers: [ClassRangeService],
    controllers: [ClassRangeController],
    imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([ClassRange])],
    exports: [ClassRangeService],
})
export class ClassRangeModule {}
