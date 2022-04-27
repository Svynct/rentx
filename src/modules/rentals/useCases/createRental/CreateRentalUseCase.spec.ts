import dayjs from "dayjs";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateRentalUseCase } from "./CreateRentalUseCase"
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayJsProvider: DayjsDateProvider;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "days").toDate();

  beforeEach(() => {
    dayJsProvider = new DayjsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dayJsProvider);
  })

  it("should be able to create a new rental", async () => {
    const rental = await createRentalUseCase.execute({
      user_id: "user_id",
      car_id: "car_id",
      expected_return_date: dayAdd24Hours
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  })

  it("should not be able to create a new rental if there is another open to the same user", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "test",
        car_id: "123",
        expected_return_date: dayAdd24Hours
      });
  
      await createRentalUseCase.execute({
        user_id: "test",
        car_id: "321",
        expected_return_date: dayAdd24Hours
      });
    }).rejects.toBeInstanceOf(AppError);
  })

  it("should not be able to create a new rental if there is another open to the same car", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "123",
        car_id: "test",
        expected_return_date: dayAdd24Hours
      });
  
      await createRentalUseCase.execute({
        user_id: "321",
        car_id: "test",
        expected_return_date: dayAdd24Hours
      });
    }).rejects.toBeInstanceOf(AppError);
  })

  it("should not be able to create a new rental with invalid return time", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "123",
        car_id: "test",
        expected_return_date: dayjs().toDate()
      });
    }).rejects.toBeInstanceOf(AppError);
  })
})