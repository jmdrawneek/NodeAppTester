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
    const ping = pingUrl(config.url);
  }
});

webserver.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

webserver.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});



  //
  //webserver.kill('SIGHUP');



function pingUrl (url) {
  const pingProcess = spawnSync(`ping`, [`-c 30`, `${url}`]);
  pingProcess.stdout(process.stdout);

  return pingProcess
}
