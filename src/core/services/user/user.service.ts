import { UserRepository } from '@app/pg/repositories';
import { User } from '@app/pg/models';
import { ICreateUserInput, IUpdateUserInput } from 'typings/app-graphql-schema';
import { PasswordService } from '@app/utils';

export class UserService {
  private userRepository: UserRepository = new UserRepository();

  public async createUser(input: ICreateUserInput): Promise<User> {
    const user = new User();
    user.username = input.username;
    user.email = input.email;
    user.firstName = input.firstName;
    user.middleName = input.middleName;
    user.lastName = input.lastName;
    user.description = input.description;

    const salt = await PasswordService.generateSalt();
    const hash = await PasswordService.generateHash(input.password, salt);

    user.passwordSalt = salt;
    user.passwordHash = hash;

    const createdUser = await this.userRepository.save(user);

    return createdUser;
  }

  public async updateUser(input: IUpdateUserInput): Promise<User | null> {
    let user = await this.findById(input.id);

    if (user) {
      user.firstName = input.firstName;
      user.middleName = input.middleName;
      user.lastName = input.lastName;
      user.description = input.description;

      user = await this.userRepository.save(user);
    }

    return user;
  }

  public async findById(id: number): Promise<User | null> {
    // this.checkCanSee();
    return this.userRepository.findById(id) || null;
  }

  public async deleteUser(id: number): Promise<User | null> {
    const user = await this.findById(id);

    if (user) {
      await this.userRepository.remove(user);
    }

    return user;
  }

  private checkCanSee() {
    // https://youtu.be/etax3aEe2dA?t=790
    // Implementation of visibility varies from service to service based on business logic
    return;
  }
}