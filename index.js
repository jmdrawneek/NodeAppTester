// Get configuration file

const config = {
  runCommand: 'gulp',
  commandArgs: 'develop-portal-cdn',
  url: 'http://localhost:3000' // Later this could be collected from the server output.
};

//

const { spawn, spawnSync } = require('child_process');
const path = require('path');




  const webserver = spawn(`npx`, [config.runCommand, config.commandArgs], {
    cwd: path.join(__dirname, '..'),
    stdio: [0,1,2]
  });


  console.log('LOGGED: ', webserver.stdout);
  console.log('LOGGED: ', webserver.stderr);

webserver.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

webserver.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

webserver.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

  //const ping = pingUrl(config.url);
  //webserver.kill('SIGHUP');



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
