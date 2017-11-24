const http = require('http');
const express = require('express');
const logMiddleware = require('@bufferapp/logger/middleware');
const RPCClient = require('micro-rpc-client');
const bugsnag = require('bugsnag');
const fs = require('fs');
const { join } = require('path');
const shutdownHelper = require('@bufferapp/shutdown-helper');
const cookieParser = require('cookie-parser');
const {
  middleware: sessionMiddleware,
} = require('@bufferapp/session-manager');
const { apiError } = require('./middleware');
const controller = require('./lib/controller');
const rpc = require('./rpc');

const app = express();
const server = http.createServer(app);

let staticAssets = {
  'bundle.js': '/static/bundle.js',
};

// NOTE: Bugsnag will not notify in local setup with current weback configuration
// https://docs.bugsnag.com/platforms/browsers/faq/#4-code-generated-with-eval-e-g-from-webpack
let bugsnagScript = '';

const isProduction = process.env.NODE_ENV === 'production';
app.set('isProduction', isProduction);

if (!isProduction) {
  /* eslint-disable global-require */
  require('babel-polyfill');
  const webpack = require('webpack');
  const config = require('./webpack.config.dev');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  /* eslint-enable global-require */

  const compiler = webpack(config);
  app.use(webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    reload: true,
  }));
  app.use(webpackHotMiddleware(compiler));
} else {
  staticAssets = JSON.parse(fs.readFileSync(join(__dirname, 'staticAssets.json'), 'utf8'));
  if (process.env.BUGSNAG_KEY) {
    bugsnag.register(process.env.BUGSNAG_KEY);
    app.set('bugsnag', bugsnag);
    // NOTE: Bugsnag will not notify in local setup with current weback configuration
    // https://docs.bugsnag.com/platforms/browsers/faq/#4-code-generated-with-eval-e-g-from-webpack
    bugsnagScript = `<script src="//d2wy8f7a9ursnm.cloudfront.net/bugsnag-3.min.js"
                              data-apikey="${process.env.BUGSNAG_KEY}"></script>`;
  }
}

const html = fs.readFileSync(join(__dirname, 'index.html'), 'utf8')
  .replace('{{{bundle}}}', staticAssets['bundle.js'])
  .replace('{{{bugsnagScript}}}', bugsnagScript);

app.use(logMiddleware({ name: 'BufferAnalyze' }));
app.use(cookieParser());

app.get('/health-check', controller.healthCheck);
const favicon = fs.readFileSync(join(__dirname, 'favicon.ico'));
app.get('/favicon.ico', (req, res) => res.send(favicon));

// All routes after this have access to the user session
// app.use(session.middleware);
app.use(sessionMiddleware.getSession({
  production: isProduction,
  sessionKeys: ['global', 'analyze'],
}));

app.use(sessionMiddleware.validateSession({
  production: isProduction,
  requiredSessionKeys: ['analyze.accessToken'],
}));

app.post('/rpc', (req, res, next) => {
  rpc(req, res)
    // catch any unexpected errors
    .catch(err => next(err));
});

app.get('*', (req, res) => res.send(html));

app.use(apiError);

server.listen(80, () => console.log('listening on port 80')); // eslint-disable-line no-console

shutdownHelper.init({ server });
