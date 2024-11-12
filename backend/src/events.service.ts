// src/events.service.ts
import { Injectable } from "@nestjs/common";

// src/events.service.ts
export interface Event {
  id: number;
  title: string;
  date: string;
  description?: string;
  image?: string; // Add image property
  video?: string; // Add video property
}

// src/events.service.ts
@Injectable()
export class EventsService {
  private events: Event[] = [];
  private idCounter = 1;

  create(event: Omit<Event, "id">): Event {
    const newEvent = { id: this.idCounter++, ...event };
    this.events.push(newEvent);
    console.log("Created Event:", newEvent); // Log created event with image/video info
    return newEvent;
  }

  findAll(): Event[] {
    return this.events;
  }

  update(id: number, event: Partial<Omit<Event, "id">>): Event | undefined {
    const index = this.events.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.events[index] = { ...this.events[index], ...event };
      return this.events[index];
    }
    return undefined;
  }

  delete(id: number): boolean {
    const index = this.events.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
      return true;
    }
    return false;
  }
}
