import express from "express";
import swaggerUI from "swagger-ui-express";
import * as swaggerDocument from "../swagger.json";

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export default app;