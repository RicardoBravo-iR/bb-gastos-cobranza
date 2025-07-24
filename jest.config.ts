import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/*.test.tsx"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  reporters: [
    "default", // Reportero predeterminado (acumula resultados)
    [
      "jest-html-reporters",
      {
        publicPath: "./report",
        filename: "prueba_unitaria.html",
        pageTitle: "BANCO BOLIVARIANO - PRUEBA UNITARIA",
        expand: true,
      },
    ],
  ],
  coverageReporters: ["html"],
  coverageDirectory: "./report/coverage",
  collectCoverage: true,
  moduleNameMapper: {
    uuid: require.resolve("uuid"),
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
