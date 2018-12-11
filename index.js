'use strict';

const carlo = require('carlo');
const path = require('path');
const os = require('os');
const Promise = require('bluebird');
const cmd = require('node-cmd');

// const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });

(async () => {
  // Launch the browser.
  const app = await carlo.launch({
    bgcolor: '#2b2e3b',
    title: 'Terminal App',
    width: 800,
    height: 800,
    channel: ['canary', 'stable'],
    // icon: path.join(__dirname, '/app_icon.png'),
    top: this.lastTop_,
    left: this.lastLeft_
  });

  // Terminate Node.js process on app window closing.
  app.on('exit', () => process.exit());

  // Tell carlo where your web files are located.
  app.serveFolder(path.join(__dirname, 'www'));
  app.serveFolder(path.join(__dirname, 'node_modules'), 'node_modules');

  // Expose 'env' function in the web environment.
  await app.exposeFunction('env', _ => process.env);
  await app.exposeFunction('loadCommand', loadCommand);

  // Navigate to the main page of your app.
  await app.load('index.html');
})();

function loadCommand(command) {
  return new Promise((resolve, reject) => {
    cmd.get(command, function(err, data, stderr) {
      if (data) return resolve(data);
      if (err) return reject(err);
    });
  });
}
