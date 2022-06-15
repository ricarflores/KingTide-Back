import {TokenService} from '@loopback/authentication';
import {
  MyUserService,
  TokenServiceBindings,
  UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response, SchemaObject
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {User} from '../models';
import {UserRepository} from '../repositories';


const LoginSchema: SchemaObject = {
  type: 'object',
  required: ['name', 'password'],
  properties: {
    name: {
      type: 'string'
    },
    password: {
      type: 'string',
      minLength: 4,
    },
  },
};

export const RequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': { schema: LoginSchema },
  },
}


export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, { optional: true })
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.userRepository.create(user);
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }


  @post('/user/create/validate')
  @response(200, {
    description: 'Get User By name',
    content: {'application/json': {schema: {
      type: 'object',
      properties:{
        name: {
          type:"string"
        }
      }
    }}},
  })
  async validateName(
    @requestBody({
      description: "Required From Login component",
      required: true,
      content:{
        'application/json': {
          schema:{
            type: 'object',
            required: ['name', 'password'],
            properties:{
              name:{
                type:"string"
              }
            }
          }
        }
      }
    }) user:  Omit<User, 'mail'>,
  ): Promise<User[]> {
    const collection = (this.userRepository.dataSource.connector as any).collection(User.modelName)
    return await collection.aggregate([
      {
        $match:{
            $and: [
                {name: user.name}
            ]
        }
      },
      {
        $project:{
          _id:0,
          name:1
        }
      }
    ]).get();
  }
  @post('/user/login')
  @response(200, {
    description: 'Get User By name',
    content: {'application/json': {schema: {
      type: 'object',
      properties:{
        name: {
          type:"string"
        },
        password:{
          type:"string"
        }
      }
    }}},
  })
  async signIn(
    @requestBody(RequestBody) credentials: any,
  ):Promise<{ token: string , name:string , mail:string, id:string}>{
    const collection = (this.userRepository.dataSource.connector as any).collection(User.modelName)
    const userGet = await collection.aggregate([
      {
        $match:{
            $and: [
                {name: credentials.name},
                {password: credentials.password}
            ]
        }
      },
      {
        $project:{
          _id:1,
          mail:1,
          name:1
        }
      }
    ]).toArray();
    if(!userGet[0]){
      throw new Error('authentication failed');
    }
    const token = await this.jwtService.generateToken(userGet[0]);
    return {token: token , name: userGet[0]['name'], mail: userGet[0]['mail'], id:userGet[0]['_id']};
  }
  @get("/users/list")
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async GetListUsersName(): Promise<User[]> {
    const collections = (this.userRepository.dataSource.connector as any).collection(User.modelName)
    return await collections.aggregate([
      {
        $project:{
          _id:1,
          mail:1,
          name:1
        }
      }
    ]).get()
  }
}
