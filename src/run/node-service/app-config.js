const
defaultHost = 'localhost',
defaultPort = 8080,
defaultVerbose = false,
propertyHost = Symbol('AppConfig:Host'),
propertyPort = Symbol('AppConfig:Port'),
propertyVerbose = Symbol('AppConfig:Verbose');

export { defaultHost, defaultPort, defaultVerbose };

export class AppConfig {
  constructor(options={}) {
    this[propertyHost] = defaultHost;
    this[propertyPort] = defaultPort;
    this[propertyVerbose] = defaultVerbose;

    this.applyFromObject(options);
  }

  get host() {
    return this[propertyHost];
  }

  get port() {
    return this[propertyPort];
  }

  get verbose() {
    return this[propertyVerbose];
  }

  applyFromObject(options) {
    if(typeof options !== 'object')
      return;

    let
    host = this[propertyHost],
    port = this[propertyPort],
    verbose = this[propertyVerbose];

    if(typeof options === 'object') {
      if(typeof options.host === 'string')
        host = options.host;
      if(typeof options.port === 'number')
        port = options.port;
      if(typeof options.verbose === 'boolean')
        verbose = options.verbose;
    }

    this[propertyHost] = host;
    this[propertyPort] = port;
    this[propertyVerbose] = verbose;
  }
}
