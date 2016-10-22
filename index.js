'use strict';

const config = require('./config.json'),
  extractor  = require('./src/file-extractor'),
  downloader = require('./src/file-downloader'),
  db         = require('./src/db'),
  Observable = require('rx').Observable,
  cardParser = require('./src/card-parser'),
  setParser  = require('./src/set-parser'),
  dbDrop     = require('./src/db-drop'),
  dbInsert   = require('./src/db-insert'),
  bunyan     = require('bunyan');

const SET_COLLECTION = 'sets',
  CARD_COLLECTION    = 'cards',
  log                = bunyan.createLogger({ name: 'index' });

let setStream = downloader(config.setSource)
  .flatMap(extractor('AllSets-x.json'))
  .flatMap(setParser);

let cardStream = downloader(config.cardSource)
  .flatMap(extractor('AllCards-x.json'))
  .flatMap(cardParser);

let dbStream = db(config.db);
let setDropStream = dbStream.flatMap(dbDrop(SET_COLLECTION));
let cardDropStream = dbStream.flatMap(dbDrop(CARD_COLLECTION));

let setInsertStream = Observable.combineLatest(setDropStream, setStream)
  .flatMap(dbInsert(SET_COLLECTION));

let cardInsertStream = Observable.combineLatest(cardDropStream, cardStream)
  .flatMap(dbInsert(CARD_COLLECTION));

Observable.merge(setInsertStream, cardInsertStream)
  .subscribe(
    () => { },
    log.error.bind(log),
    () => {
      dbStream.subscribe((db) => db.close());
      log.info('Done.')
    });
