import { AppError } from "@shared/errors/AppError";
import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase"

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe("Create category", () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepositoryInMemory);
  })

  it("Should be able to create a new category", async () => {
    const categoryDTO = {
      name: "Category test",
      description: "Category description test"
    }

    await createCategoryUseCase.execute(categoryDTO)

    const category = await categoriesRepositoryInMemory.findByName(categoryDTO.name);

    expect(category).toHaveProperty("id");
  })

  it("Should not be able to create a new category with an existing name", async () => {
    const categoryDTO = {
      name: "Category test",
      description: "Category description test"
    }

    await createCategoryUseCase.execute(categoryDTO)

    await expect(createCategoryUseCase.execute(categoryDTO))
      .rejects.toEqual(new AppError("Category already exists!"));
  })
})