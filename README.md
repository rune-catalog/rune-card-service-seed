## mtgjson importer

Imports all card definitions from an mtgjson archive. After running the script,
you'll have two collections set up in your mongodb database:

* **cards** Contains each card regardless of how many times its been printed
* **sets** Contains each set including all cards that were printed in it

See the docs over at [mtgjson](http://mtgjson.com/documentation.html) for
details.

```
npm run-script import
```

Logging is done via [Bunyan](https://www.npmjs.com/package/bunyan). Get nice
output by piping to it:

```
npm run-script import | bunyan
```
