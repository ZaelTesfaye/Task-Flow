import { collectDefaultMetrics } from "prom-client";

const metricsLoader = () => {
  collectDefaultMetrics();
};

export default metricsLoader;
