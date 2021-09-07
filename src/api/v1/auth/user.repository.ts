import { getRepository } from 'typeorm';
import { User } from 'src/models';
import { AuthCredentialsDto } from './auth.interface';
import { dbErrorCode } from 'src/commons/database/error-code';

export class UserRepository {
  createUser(authCredentialsDto: AuthCredentialsDto) {
    const repository = getRepository(User)
    const user = repository.create({
      firstName: authCredentialsDto.firstName,
      lastName: authCredentialsDto.lastName,
      email: authCredentialsDto.email,
      password: authCredentialsDto.password
    });
    try {
      return repository.save(user);
    } catch (error) {
      if (error === dbErrorCode.duplicate) {

      }
    }
  }
}
