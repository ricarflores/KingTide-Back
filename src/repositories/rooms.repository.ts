import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Rooms, RoomsRelations} from '../models';

export class RoomsRepository extends DefaultCrudRepository<
  Rooms,
  typeof Rooms.prototype.idTalk,
  RoomsRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Rooms, dataSource);
  }
}
