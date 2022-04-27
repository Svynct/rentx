import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";

import createConnection from "@shared/infra/typeorm";

import "@shared/container";
import { AppError } from "@shared/errors/AppError";

import { router } from "./routes";
import swaggerFile from "../../../swagger.json";

createConnection();
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message
    })
  }

  return response.status(500).json({
    status: "Error",
    message: `Internal server error - ${err.message}`
  })
})

app.listen(3333, () => {
  console.log("")
  console.log("Server is running! http://localhost:3333/api-docs")
  console.log("/api-docs -> [ GET ]")
  console.log("/sessions -> [ POST ]")
  console.log("/categories -> [ POST, GET ]")
  console.log("/categories/import -> [ POST ]")
  console.log("/specifications -> [ POST ]")
  console.log("/cars -> [ POST ]")
  console.log("/cars/available -> [ GET ]")
  console.log("/cars/specifications -> [ POST ]")
  console.log("/cars/images -> [ POST ]")
  console.log("/rentals -> [ POST ]")
});