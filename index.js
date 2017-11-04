// Get configuration file

const config = {
  runCommand: 'gulp',
  commandArgs: 'develop-portal-cdn',
  url: 'http://localhost:3000' // Later this could be collected from the server output.
};

//

const { spawn } = require('child_process');
const path = require('path');

const webserver = webServer(config.runCommand, config.commandArgs);


const ping = pingUrl(config.url);




webserver.kill('SIGHUP');



function webServer (cmd, commandArgs) {
  const webserver = spawn(`${cmd}`, [commandArgs], {cwd: path.join(__dirname, '..')});

  webserver.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  webserver.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  webserver.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  return webserver;
}


function pingUrl (url) {

  const pingProcess = spawn(`ping`, [`-c 30 ${url}`]);

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
