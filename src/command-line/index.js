import path from 'path';
import program from 'commander';
import pkg from '../../package.json';
import fs from 'fs';
import mkdirp from 'mkdirp';
import ConfigDriver from '../adopter/ConfigDriver';

program.version(pkg.version, '-v, --version');
program.option('');
program.option('    --home <path>', 'home path');

import './start';
import './config';
import './list';
import './add';
import './remove';
import './reset';
import './edit';

var argv = program.parseOptions(process.argv);
if (program.home) {
    ConfigDriver.HOME = program.home;
}

var config = ConfigDriver.HOME + '/config.js';
if (!fs.existsSync(config)) {
    mkdirp.sync(ConfigDriver.HOME);
    fs.writeFileSync(
        config,
        fs.readFileSync(path.resolve(__dirname, '../../defaults/config.js'))
    );
    console.log('Config created:');
    console.log(config);
}

program.parse(argv.args);

if (!program.args.length) {
    program.parse(process.argv.concat('start'));
}
