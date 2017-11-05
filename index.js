// Get configuration file
const config = {
  runCommand: 'gulp',
  commandArgs: 'develop-portal-cdn',
  url: 'localhost', // Later this could be collected from the server output.
  port: '3000'
};

const { spawn, spawnSync } = require('child_process');
const path = require('path');

const webserver = spawn(`npx`, [config.runCommand, config.commandArgs], {
  cwd: path.join(__dirname, '..')
});

// Pipe the log from the child pack to the main process output.
webserver.stdout.pipe(process.stdout)


webserver.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
  const taskName = new RegExp(`Finished '${config.commandArgs}'`, 'g');
  console.log(taskName);

  if (String(data).match(taskName)) {
    console.log('FOUND IT!!!');
    pingUrl(config.url);
  }
});

webserver.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

webserver.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});


function pingUrl (url) {
  const pingProcess = spawnSync(`ping`, [`-c 10`, `-p ${config.port}`, `${url}`]);
  const testForSuccess = new RegExp('0% packet loss', 'g')
  console.log('Web server up and tested with ping');

  if (pingProcess.output.toString('utf8').match(testForSuccess)) {
    // RUN TESTS!!!!
    runTests();
  }

  return pingProcess
}

function runTests () {
  const cucumber = spawnSync(`npx`, ['cucumber-js']);
  console.log(cucumber.output.toString('utf8'));


  // Kill the web server as we're now done.
  webserver.kill('SIGHUP');
}
