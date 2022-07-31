import fs from 'fs';
import util from 'util';
import http from 'http';
import _yargs from 'yargs';
import { EOL } from 'os';
import { hideBin } from 'yargs/helpers';
import { AppConfig } from './app-config.js';

const
cfg = new AppConfig(),
cfgFilePath = '/etc/node-service.json',
fsStatPromise = util.promisify(fs.stat),
fsReadFilePromise = util.promisify(fs.readFile),
httpServer = http.createServer((req, res) => {
  logVerbose('HTTP request from %s.', req.connection.remoteAddress);
  res.writeHead(200, { 'Content-Type' : 'text/plain' });
  res.end('Thank you for visiting.' + EOL);
});

var
started = false,
starting = false,
stopping = false,
stopped = true;

main().catch(err => console.error(err.toString()));

async function main() {

  await loadSystemConfig();
  await loadArgumentConfig();
  await startHTTP();

  return await new Promise((resolve, reject) => {

    const signalFinish = () => stopHTTP().then(resolve, reject);

    process.once('SIGINT', signalFinish) // CTRL+C
      .once('SIGQUIT', signalFinish)     // Keyboard quit
      .once('SIGTERM', signalFinish);    // `kill` command
  });
}

function logVerbose(... args) {
  if(!cfg.verbose)
    return;

  return void console.log(... args);
}

async function loadArgumentConfig() {
  const
  yargs = _yargs(hideBin(process.argv)),
  argv = yargs.usage('$0 [options]')
    .option('host',    { type: 'string',  default: cfg.host,    alias: 'H', describe : 'HTTP host address' })
    .option('port',    { type: 'number',  default: cfg.port,    alias: 'p', describe : 'HTTP port' })
    .option('verbose', { type: 'boolean', default: cfg.verbose, alias: 'v', describe : 'Enable verbose' })
    .argv;

  cfg.applyFromObject(argv);
}

async function loadSystemConfig() {
  if(await fsStatPromise(cfgFilePath)) {
    logVerbose('Reading system config file (%s).', cfgFilePath);

    const parsed = JSON.parse(await fsReadFilePromise(cfgFilePath));

    if(typeof parsed !== 'object')
      throw new Error(`Environment config file (${cfgFilePath}) does not contain a JSON object.`);

    cfg.applyFromObject(parsed);
  }
  else
    logVerbose('System config file (%s) does not exist.', cfgFilePath);
}

async function startHTTP() {
  if(started || starting)
    return;

  starting = true;

  logVerbose('HTTP Server starting (%s:%d)..', cfg.host, cfg.port);

  return await new Promise((resolve, reject) => {
    httpServer.once('error', reject);
    httpServer.listen(cfg.port, cfg.host, () => {
      starting = false;
      started = true;

      logVerbose('HTTP server started.');
      httpServer.removeListener('error', reject);
      resolve();
    });
  });
}

async function stopHTTP() {
  if(stopped || stopping)
    return;

  stopping = true;

  logVerbose('HTTP Server stopping..');

  return await new Promise((resolve, reject) => {
    httpServer.once('error', reject);
    httpServer.close(() => {
      started = false;
      stopping = false;
      stopped = true;
      logVerbose('HTTP server stopped.');
      httpServer.removeListener('error', reject);
      resolve();
    });
  });
}
