import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Mensajes, MensajesRelations} from '../models';

export class MensajesRepository extends DefaultCrudRepository<
  Mensajes,
  typeof Mensajes.prototype.id,
  MensajesRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Mensajes, dataSource);
  }
}
