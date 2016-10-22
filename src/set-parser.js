'use strict';

const fs       = require('fs'),
  Observable   = require('rx').Observable,
  StreamObject = require('stream-json/utils/StreamObject'),
  bunyan       = require('bunyan');

let log = bunyan.createLogger({ name: 'setParse' });

module.exports = (filePath) => {
  return Observable.create((subscriber) => {
    let stream = StreamObject.make();

    stream.output.on('error', subscriber.onError.bind(subscriber));

    stream.output.on('data', (object) => {
      log.info(`Parsed set ${object.key}`);
      subscriber.onNext(object.value);
    });

    stream.output.on('end', subscriber.onCompleted.bind(subscriber));

    fs.createReadStream(filePath)
      .pipe(stream.input);
  });
};
