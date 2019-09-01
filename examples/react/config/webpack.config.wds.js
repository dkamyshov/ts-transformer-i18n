const { createConfig } = require("./createConfig");

module.exports = [
  createConfig(["ru", "en"], "en", "/en"),
  createConfig(["ru", "en"], "ru", "/ru")
];
