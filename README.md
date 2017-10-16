# Trails to SDKs

Generate an SDK from a TrailsJs App using GULP.

## Getting Started

```
./node_modules/.bin/gulp --config './config.sample.json' --log-level 'warning'
```

### --config './config.sample.json'

Change the `--config` path to your configuration file.

### --log-level 'warning'

Omit this argument to use the default level (`warning`), other accepted levels are:

- `emerg`
- `alert`
- `crit`
- `error`
- `warning`
- `notice`
- `info`
- `debug`

Log levels are working accordingly to (Winston)[https://github.com/winstonjs/winston#logging-levels].

### Prerequisites

You must have a working [TrailsJs](https://trailsjs.io/) Application, NodeJs 4.0 or newer and either NPM or Yarn.

### Installing

Download the source code, use NPM or Yarn to install dependencies and run GULP.

## Supported Trailpacks

### ORM

- [trailpack-mongoose](https://github.com/trailsjs/trailpack-mongoose)

### Security

- [trailpack-passport](https://github.com/jaumard/trailpack-passport)

## Supported Languages

- [javascript-node](libs/sdks/javascript-node/index.js) NodeJs client using `got` and `ajv` under the hood

### Tree View

```
trails-to-sdks
└── libs
    ├── schemas
    │   ├── config
    │   └── sdks
    │       ├── {language}-{framework}.js <- user config schema for a particular language/framework
    │       └── javascript-node.js <- use it as example
    └── sdks
        ├── {language}-{framework} <- generator for a particular language/framework
        │   ├── template <- list of .mustache templates
        │   ├── config.js <- generator config
        │   └── index.js <- generator engine
        ├── javascript-node <- use it as example
        └── index.js <- add `exports['{language}-{framework}'] = require('./{language}-{framework}')` to support the generator
```

- `{language}` is the language you will support (e.g. `javascript`)
- `{framework}` is the framework you will supoort (e.g. `angular`)

## Running the tests

**TODO: write some tests**

## Built With

* [Gulp](https://gulpjs.com/) - Automation engine
* [TrailsJs](https://trailsjs.io/) - Server framework supported
* [Mustache](https://mustache.github.io/) - Template engine

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/matteozambon89/trails-to-sdks/tags).

## Authors

* **Matteo Zambon** - *Initial work* - [matteozambon89](https://github.com/matteozambon89)

See also the list of [contributors](https://github.com/matteozambon89/trails-to-sdks/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
