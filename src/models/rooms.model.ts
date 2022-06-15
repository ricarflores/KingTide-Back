import {Entity, model, property} from '@loopback/repository';

@model()
export class Rooms extends Entity {
  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  users: string[];

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  idTalk: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any


  constructor(data?: Partial<Rooms>) {
    super(data);
  }
}

export interface RoomsRelations {
  // describe navigational properties here
}

export type RoomsWithRelations = Rooms & RoomsRelations;
