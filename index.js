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
  const webserver = spawnSync(`npx`, [cmd, commandArgs], {cwd: path.join(__dirname, '..')});

  webserver.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  webserver.output.on('data', (data) => {
    console.log(`Output: ${data}`);
  });

  webserver.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  webserver.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  const ping = pingUrl(config.url);
  webserver.kill('SIGHUP');



  return webserver;
}


function pingUrl (url) {
  const pingProcess = spawnSync(`ping`, [`-c 30`, `${url}`]);

  pingProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  pingProcess.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  pingProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  return pingProcess
}
