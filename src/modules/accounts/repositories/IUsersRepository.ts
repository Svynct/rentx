import { User } from "../infra/typeorm/entities/User"
import { ICreateUserDTO } from "../dtos/ICreateUserDTO"

interface IUsersRepository {
  findById(id: string): Promise<User>
  findByEmail(email: string): Promise<User>
  create(data: ICreateUserDTO): Promise<void>
}

export { IUsersRepository }