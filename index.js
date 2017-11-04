// Get configuration file

const config = {
  runCommand: 'gulp develop-portal-cdn',
  url: 'http://localhost:3000' // Later this could be collected from the server output.
};

//

const { spawn } = require('child_process');

const webserver = webServer(config.runCommand);


const ping = pingUrl(config.url);




webserver.kill('SIGHUP');



function webServer (cmd) {
  const webserver = spawn(cmd);

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


function pingUrl (command) {

  const pingProcess = spawn(`ping -c 30 ${command}`);

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
