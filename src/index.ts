import app from "./app";
import { env } from "./config/config";
import prisma from "./db/db";

const port = Number(env?.PORT ?? 3000);

prisma
  .$connect()
  .then(() =>
    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    }),
  )
  .catch((err) => {
    console.log(`ERROR: DB connection failed ${err}`);
    process.exit(1);
  });
