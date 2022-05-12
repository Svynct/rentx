import { container } from "tsyringe"

import { LocalStorageProvider } from "./implementations/LocalStorageProvider"
import { S3StorageProvider } from "./implementations/S3StorageProvider"
import { IStorageProvider } from "./IStorageProvider"

const diskStorage = {
  local: container.resolve(LocalStorageProvider),
  s3: container.resolve(S3StorageProvider)
}

container.registerInstance<IStorageProvider>(
  "StorageProvider",
  diskStorage[process.env.disk]
)