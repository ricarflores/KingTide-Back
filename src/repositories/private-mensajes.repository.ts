import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {PrivateMensajes, PrivateMensajesRelations} from '../models';

export class PrivateMensajesRepository extends DefaultCrudRepository<
  PrivateMensajes,
  typeof PrivateMensajes.prototype.id,
  PrivateMensajesRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(PrivateMensajes, dataSource);
  }
}
