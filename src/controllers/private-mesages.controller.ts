import {
  repository
} from '@loopback/repository';
import {get, getModelSchemaRef, post, requestBody, response, SchemaObject} from '@loopback/rest';
import {randomBytes} from 'crypto';
import {Mensajes} from '../models/mensajes.model';
import {Rooms} from '../models/rooms.model';
import {MensajesRepository} from '../repositories/mensajes.repository';
import {PrivateMensajesRepository} from '../repositories/private-mensajes.repository';
import {RoomsRepository} from '../repositories/rooms.repository';

// import {inject} from '@loopback/core';

const GetRoomSchema: SchemaObject = {
  type: 'object',
  required: ['from', 'too'],
  properties: {
    from: {
      type: 'string'
    },
    too: {
      type: 'string'
    },
  },
}
export const requestRoom = {
  description: 'Get Private Room Info',
  required: true,
  content: {
    'application/json': { schema: GetRoomSchema },
  },
}


export class PrivateMesagesController {
  constructor(
    @repository(PrivateMensajesRepository)
    public privateMensageRepository: PrivateMensajesRepository,
    @repository(RoomsRepository)
    public roomsReposotory:RoomsRepository,
    @repository(MensajesRepository)
    public mensajeRepository:MensajesRepository
  ) {}

  @post('get/messages/room')
  @response(200,{
    description: 'Get Room Messages',
    content: {'application/json': {schema: getModelSchemaRef(Mensajes)}},
  })
  async getRoomMessagess(
    @requestBody({
      description:"Require idTalk",
      required: true,
      content:{
        'application/json':{
          schema:{
            type: 'object',
            required: ['idTalk'],
            properties:{
              idTalk:{
                type:"string"
              }
            }
          }
        }
      }
    }) mensajes: Mensajes,
  ): Promise<Mensajes[]>{
    const collection = (this.mensajeRepository.dataSource.connector as any).collection(Mensajes.modelName)
    let data = await collection.aggregate([
      {
        $match:{
          idTalk:mensajes.idTalk
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
    ]).toArray()
    return data
  }

  @post('/getRoom')
  @response(200,{
    description: 'Get Room Info',
    content: {'application/json': {schema: {
      type: 'object',
      properties:{
        from: {
          type:"string"
        },
        too:{
          type:"string"
        }
      }
    }}},
  })
  async getRoomInfo(
    @requestBody(requestRoom) userRoomInfo: any,
  ): Promise<Rooms[]>{
    const collection = (this.roomsReposotory.dataSource.connector as any).collection(Rooms.modelName)
    let data = [];
    if(userRoomInfo.from !== userRoomInfo.too)
    {
      data = await collection.aggregate([
        {
          $match:{
            users:{$in:[userRoomInfo.from]}
          }
        },
        {
          $match:{
            users:{$in:[userRoomInfo.too]}
          }
        },
        {
          $project:{
            _id:0,
            idTalk:1
          }
        }
      ]).toArray();
    }
    else{
      data = await collection.aggregate([
        {
            $match:{
                "users.0": userRoomInfo.from
            }
        },
        {
            $match:{
                "users.1": userRoomInfo.too
            }
        }
      ]).toArray()
    }
    if(data.length === 0 && userRoomInfo.from !== "0" && userRoomInfo.too !== "0"){
      let usersToInser = [];
      usersToInser.push(userRoomInfo.from);
      usersToInser.push(userRoomInfo.too);
      let create = await collection.insertMany([
        {
          users: usersToInser,
          idTalk: randomBytes(16).toString("hex")
        }
      ])
      let idTalk = await collection.aggregate([
        {
          $match:{
            _id: create.insertedIds['0']
          }
        }
      ]).toArray()
      return idTalk[0]
    }else{
      return data[0]
    }
  }

  @get('/rooms')
  @response(200,{
    description: 'Get All Rooms',
    content: {'application/json': {schema: getModelSchemaRef(Rooms)}},
  })
  async getAllRooms(): Promise<Rooms[]>{
    const collection = (this.privateMensageRepository.dataSource.connector as any).collection(Rooms.modelName)
    return await collection.aggregate([
      {
        $match:{

        }
      }
    ]).get()
  }


}
