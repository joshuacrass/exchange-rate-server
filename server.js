const { SEED, PAIR_COUNT, UPDATE_INTERVAL } = require("./constants");
const Chance = require("chance");
const chance = new Chance(SEED);

const ratesGenerator = require("./ratesGenerator")({
  generator: chance,
  pairCount: PAIR_COUNT,
  updateInterval: UPDATE_INTERVAL
});

const express = require("express");
const server = express();

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

server.get("/api/currency/configuration", (req, res) => {
  res.json({
    currencyPairs: ratesGenerator.getCurrencyPairs()
  });
});

server.get("/api/currency/rates", (req, res) => {
  const allRates = ratesGenerator.getCurrentRates();
  const { currencyPairIds = [] } = req.query;

  let rates = {};
  for (let pairId of currencyPairIds) {
    if (typeof allRates[pairId] !== "undefined") {
      rates[pairId] = allRates[pairId];
    }
  }

  res.json({
    rates
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

module.exports = server;
