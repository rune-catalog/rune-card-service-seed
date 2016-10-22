'use strict';

const Observable = require('rx').Observable,
  Client         = require('mongodb').MongoClient,
  bunyan         = require('bunyan');

let log = bunyan.createLogger({ name: 'db' });

module.exports = (url) => {
  log.info(`Opening connection to ${url}`)
  return Observable.fromNodeCallback(Client.connect)(url);
};
