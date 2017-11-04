// Get configuration file

const config = {
  runCommand: 'gulp',
  commandArgs: 'develop-portal-cdn',
  url: 'http://localhost:3000' // Later this could be collected from the server output.
};

//

const { spawn, spawnSync } = require('child_process');
const path = require('path');
const webserver = webServer(config.runCommand, config.commandArgs);









function webServer (cmd, commandArgs) {
  console.log(path.join(__dirname, '..'));
  const webserver = spawnSync(`npx`, [cmd, commandArgs], {
    cwd: path.join(__dirname, '..'),
    stdio: [0,1,2]
  });

  webserver.stdout.on('data', (data) => {
    console.log(`stdout: ${data.toString()}`);
  });

  webserver.output.on('data', (data) => {
    console.log(`Output: ${data.toString()}`);
  });

  webserver.stderr.on('data', (data) => {
    console.log(`stderr: ${data.toString()}`);
  });

  webserver.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  console.log('LOGGED: ', webserver.stdout.toString());
  console.log('LOGGED: ', webserver.stderr.toString());

  const ping = pingUrl(config.url);
  webserver.kill('SIGHUP');



  return webserver;
}


function pingUrl (url) {
  const pingProcess = spawnSync(`ping`, [`-c 30`, `${url}`], {
    stdio:[0,1,2]
  });

  pingProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data.toString()}`);
  });

  pingProcess.stderr.on('data', (data) => {
    console.log(`stderr: ${data.toString()}`);
  });

  pingProcess.on('close', (code) => {
    console.log(`child process exited with code ${code.toString()}`);
  });

  console.log('LOGGED: ', pingProcess.stdout.toString());
  console.log('LOGGED: ', pingProcess.stderr.toString());

  return pingProcess
}
