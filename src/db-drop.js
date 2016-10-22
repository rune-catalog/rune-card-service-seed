'use strict';

const Observable = require('rx').Observable,
  bunyan         = require('bunyan');

let log = bunyan.createLogger({ name: 'dbDrop' });

module.exports = (collectionName) => {
  return (db) => {
    return Observable.create((subscriber) => {
      log.info(`Dropping all records from "${collectionName}"`);
      db.collection(collectionName).deleteMany({ }, (err) => {
        if (err) {
          subscriber.onError(err);
        }
        subscriber.onNext(db);
        subscriber.onCompleted();
      });
    });
  }
};
