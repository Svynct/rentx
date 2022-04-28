import { Connection, createConnection, getConnectionOptions } from "typeorm";

interface IOptions {
  host: string;
}

getConnectionOptions().then(options => {
  const newOptions = options as IOptions;
  newOptions.host = process.env.NODE_ENV === "test" ? "localhost" : "database"
  createConnection({
    ...options,
    synchronize: false
  });
});

export default async(host = "database"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  Object.assign(defaultOptions, {
    host: process.env.NODE_ENV === "test" ? "localhost" : host,
    database: process.env.NODE_ENV === "test" ? "rentx_test" : defaultOptions.database
  })

  return createConnection(defaultOptions);
}