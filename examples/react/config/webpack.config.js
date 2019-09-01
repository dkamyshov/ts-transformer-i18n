const { createConfig } = require("./createConfig");

module.exports = [
  createConfig(["ru", "en"], "ru"),
  createConfig(["ru", "en"], "en")
];
