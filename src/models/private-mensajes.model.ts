import {Entity, model, property} from '@loopback/repository';

@model()
export class PrivateMensajes extends Entity {
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
    type: 'string',
    required: true,
  })
  idTalk: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint{settings: {strict: false}}/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PrivateMensajes>) {
    super(data);
  }
}

export interface PrivateMensajesRelations {
  // describe navigational properties here
}

export type PrivateMensajesWithRelations = PrivateMensajes & PrivateMensajesRelations;
