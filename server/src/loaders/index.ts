import { type Express } from "express";
import expressLoader from "./express.js";
import metricsLoader from "./metrics.js";

const loader = (app: Express) => {
  expressLoader(app);
  metricsLoader();
};

export default loader;
