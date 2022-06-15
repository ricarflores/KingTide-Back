import {Entity, model, property} from '@loopback/repository';

@model()
export class Mensajes extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  from: string;

  @property({
    type: 'string',
    required: true,
  })
  to: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  mensaje: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'string'
  })
  idTalk: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  constructor(data?: Partial<Mensajes>) {
    super(data);
  }
}

export interface MensajesRelations {
  // describe navigational properties here
}

export type MensajesWithRelations = Mensajes & MensajesRelations;
