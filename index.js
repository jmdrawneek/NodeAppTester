const config = {
  runCommand: 'gulp',
  commandArgs: 'develop-portal-cdn',
  url: 'localhost', // Later this could be collected from the server output.
  port: '3000',
  deps: ['cucumber', 'jest', 'puppeteer']
};

const { spawn, spawnSync } = require('child_process');
const path = require('path');

// Install the packages require to run tests.
// ToDo: Figure out how to get Jenkins to use a fixed workplace so these could be included in the docker image.
const installDep = spawnSync(`npm`, ['install', ...config.deps], {
  cwd: path.join(__dirname, '..')
});

console.log(installDep.output.toString('utf8'));


// We use npx because gulp binaries can be allusive.
const webserver = spawn(`npx`, [config.runCommand, config.commandArgs], {
  cwd: path.join(__dirname, '..')
});


webserver.stdout.on('data', (data) => {
  console.log(`gulp -> ${data}`);
  const taskName = new RegExp(`Finished '${config.commandArgs}'`, 'g');

  // Watch the console output for the gulp task.
  if (String(data).match(taskName)) {
    console.log('\'Finished\' detected in gulp output so node server is up.');
    pingUrl(config.url);
  }
});

webserver.stderr.on('data', (data) => {
  console.log(`gulp error -> ${data}`);
});

webserver.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});


function pingUrl (url) {
  // Ping the url to make sure it's up and running before we start the tests.
  const pingProcess = spawnSync(`ping`, [`-c 10`, `-p ${config.port}`, `${url}`]);
  const testForSuccess = new RegExp('0% packet loss', 'g')
  console.log('Web server up and tested with ping');

  if (pingProcess.output.toString('utf8').match(testForSuccess)) {
    runTests();
  }

  return pingProcess
}

function runTests () {
  const cucumber = spawn(`node`, ['./node_modules/.bin/cucumber-js'], {
    cwd: path.join(__dirname, '..')
  });

  cucumber.stdout.on('data', (data) => {
    console.log(`cucumber -> ${data}`);
  });

  cucumber.stderr.on('data', (data) => {
    console.log(`cucumber error -> ${data}`);
  });

  cucumber.on('close', (code) => {
    console.log(`cucumber process exited with code ${code}`);
    console.log('KILLING WEB SERVER');
    webserver.kill('SIGHUP');
  });

}
