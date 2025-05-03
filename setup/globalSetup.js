process.env.NODE_ENV = "test";
const { syncDb } = require("../src/config/database");

module.exports = async () => {
  // force-sync before any tests run
  await syncDb();
};