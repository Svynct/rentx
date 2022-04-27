import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject } from "tsyringe";

interface IRequest {
  car_id: string;
  specifications_id: string[];
}

class CreateCarSpecificationUseCase {

  constructor(
    // @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    private specificationsRepository: ISpecificationsRepository
  ){}

  async execute({ car_id, specifications_id }: IRequest): Promise<void> {
    const car = await this.carsRepository.findById(car_id);
    
    if (!car) {
      throw new AppError("Car does not exist!");
    }

    const specifications = await this.specificationsRepository.findByIds(specifications_id);

    car.specifications = specifications;

    await this.carsRepository.create(car);

    console.log(car);
  }
}

export { CreateCarSpecificationUseCase }