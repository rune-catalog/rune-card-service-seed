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
      subscriber.onNext(object.value);
    });

    stream.output.on('end', () => {
      log.info(`Parsed all cards`);
      subscriber.onCompleted();
    }

    fs.createReadStream(filePath)
      .pipe(stream.input);
  });
};
