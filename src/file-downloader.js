'use strict';

let http = require('http'),
  Observable = require('rx').Observable,
  bunyan = require('bunyan');

let log = bunyan.createLogger({ name: 'downloader' });

module.exports = (url) => {
  log.info(`Downloading file from ${url}`);
  return Observable.fromCallback(http.get)(url);
};
