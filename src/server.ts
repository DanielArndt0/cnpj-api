import "dotenv/config";
import { buildApp } from "./app/app.js";

const start = async () => {
  try {
    const app = await buildApp();
    const port = Number(process.env.PORT || 3000);

    await app.listen({ port, host: "0.0.0.0" });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();
