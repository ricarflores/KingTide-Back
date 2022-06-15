import {
  repository
} from '@loopback/repository';
import {get, getModelSchemaRef, response} from '@loopback/rest';
import {Mensajes} from '../models/mensajes.model';
import {MensajesRepository} from '../repositories/mensajes.repository';

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';


export class MensajesController {
  constructor(
    @repository(MensajesRepository)
    public mensajeRepository: MensajesRepository
  ) {}

  @get('/mensajes')
  @response(200,{
    description: 'Get All Messajes',
    content: {'application/json': {schema: getModelSchemaRef(Mensajes)}},
  })
  async getAllPublicMessajes(
  ): Promise<Mensajes[]> {
    const collection = (this.mensajeRepository.dataSource.connector as any).collection(Mensajes.modelName)
    return await collection.aggregate([
      {
        $match:{
          type:  "public"
        }
      },
      {
        $project:{
          _id:1,
          from:1,
          to:1,
          type:1,
          mensaje:1,
          date:{
            $dateToString:{
              format:"%H:%M:%S",
              date:"$date"
            }
          }
        }
      }
    ]).get()
  }

}
