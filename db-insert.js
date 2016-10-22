'use strict';

const Observable = require('rx').Observable,
  bunyan = require('bunyan');

let log = bunyan.createLogger({ name: 'dbInsert' });

module.exports = (collectionName) => {
  return (dbData) => {
    let db = dbData[0],
      data = dbData[1];

    return Observable.create((subscriber) => {
      log.debug(`Inserting data into "${collectionName}"`);
      db.collection(collectionName).insertOne(data, (err, db) => {
        if (err) {
          subscriber.onError(err);
        }

        log.debug('Inserted record');
        subscriber.onNext(dbData);
        subscriber.onCompleted();
      });
    });
  }
};
