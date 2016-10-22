'use strict';

const config = require('./config.json'),
  extractor  = require('./file-extractor'),
  downloader = require('./file-downloader'),
  db         = require('./db'),
  Observable = require('rx').Observable,
  cardParser = require('./card-parser'),
  setParser  = require('./set-parser'),
  dbDrop     = require('./db-drop'),
  dbInsert   = require('./db-insert'),
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
    log.error,
    () => {
      dbStream.subscribe((db) => db.close());
      log.info('Done.')
    });
