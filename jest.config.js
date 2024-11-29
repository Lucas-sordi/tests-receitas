// handle multiple environments
const target = process.env.TARGET;
if(!target) throw new Error("Missing TARGET environment variable");

export default {
  "moduleFileExtensions": ["js", "json"],
  "rootDir": "./",
  "testMatch": ["<rootDir>/src/tests/**/*.{spec,test}.js"],
  "testEnvironment": "node",
  "setupFiles": [
      `<rootDir>/src/config/${target}.js`
  ],
  "transform": {
    "^.+\\.js$": "babel-jest"
  },
  "reporters": [
    "default",
    ["jest-html-reporters", {
      "filename": "report.html"
    }]
  ],
}