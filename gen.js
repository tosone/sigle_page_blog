const fs = require('fs');
const glob = require('glob');
const crypto = require('crypto');
const spawn = require('child_process').spawn;

let database = "data.json";

glob('data/**/*.md', (err, files) => {
    if (err) {
        console.log(err);
    } else {
        Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
                let log = spawn('git', ['log', '-n', '1', '--pretty=format:%ct', '--', file]);
                log.stdout.on('data', data => {
                    var title = fs.readFileSync(file, 'utf8').split('\n')[0];
                    resolve({
                        title,
                        path: file,
                        time: data + "000",
                        hash: crypto.createHash('sha256').update(title.toString(), 'utf8').digest('base64')
                    });
                });
                log.stderr.on('data', data => {
                    console.log(`time: ${data}.`);
                });
            });
        })).then((data) => {
            fs.writeFileSync(database, JSON.stringify(data), 'utf8');
        });
    }
});
