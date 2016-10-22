'use strict';

const Observable = require('rx').Observable,
  StreamObject   = require('stream-json/utils/StreamObject'),
  fs             = require('fs'),
  bunyan         = require('bunyan');

const log = bunyan.createLogger({ name: 'cardParser' });

module.exports = (filePath) => {
  return Observable.create((subscriber) => {
    let stream = StreamObject.make();

    stream.output.on('error', subscriber.onError.bind(subscriber));

    stream.output.on('data', (object) => {
      log.info(`Parsed card ${object.key}`);
      subscriber.onNext(object.value);
    });

    stream.output.on('end', subscriber.onCompleted.bind(subscriber));

    fs.createReadStream(filePath)
      .pipe(stream.input);
  });
};
