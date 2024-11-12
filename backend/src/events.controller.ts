import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { EventsService, Event } from "./events.service";
import { CreateEventDto } from "./event.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image")) // Handle image upload
  create(
    @UploadedFile() image: Express.Multer.File, // Ensure multer types are installed
    @Body() createEventDto: CreateEventDto,
  ): Event {
    // You can also handle video upload similarly by adding another interceptor if needed
    const eventData = { ...createEventDto, image: image?.filename }; // Store filename or path as needed
    return this.eventsService.create(eventData);
  }

  @Get()
  findAll(): Event[] {
    return this.eventsService.findAll();
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateEventDto: Partial<CreateEventDto>,
  ): Event | undefined {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(":id")
  delete(@Param("id") id: string): boolean {
    return this.eventsService.delete(+id);
  }
}
