const { exec } = require('child_process');
const fs = require('fs');
const log = [];
function run(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { cwd: __dirname }, (err, stdout, stderr) => {
      log.push('CMD: ' + cmd);
      log.push('STDOUT: ' + stdout.trim());
      log.push('STDERR: ' + stderr.trim());
      if (err) log.push('ERR: ' + err.message);
      resolve();
    });
  });
}
(async () => {
  await run('git --version');
  await run('git status --short');
  await run('git remote -v');
  await run('git branch --show-current');
  await run('git rev-parse --show-toplevel');
  await run('git push -u origin master --dry-run');
  fs.writeFileSync('git-push-check.log', log.join('\n'), 'utf8');
})();
