if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

const config = require('boring-config');
const logger = require('boring-logger');
const paths = require('paths');
const util = require('util');
const InitPipeline = require('../init-pipeline');

async function startExpress(app, port) {
  app.listen = util.promisify(app.listen);
  return app.listen(port);
}

class BoringServer extends InitPipeline {

  async start(options) {

    const webpackConfig = config.get('boring.isDevelopment', true) ?
      paths.boring_webpack_dev_config : paths.boring_webpack_prod_config;

    const injections = await this.build({
      port: process.env.PORT || config.get('boring.app.port'),
      webpack_config: require(webpackConfig),
      startExpress,
      ...options,
    });

    return await this.perform('listen', injections, async () => {
      const port = injections.port;
      await injections.startExpress(this.app, port);
      logger.info('Listening on port ' + port);

      return injections;
    });

  }
}

module.exports = BoringServer;
