import ClientManager from '../ClientManager';
import fs from 'fs';
import program from 'commander';
import ConfigDriver from '../adopter/ConfigDriver';

program
    .command('remove <name>')
    .description('Remove an existing user')
    .action(function(name) {
        const path = ConfigDriver.HOME + '/users';
        const test = path + '/.test';
        try {
            fs.mkdirSync(test);
            fs.rmdirSync(test);
        } catch (e) {
            console.log('');
            console.log('You have no permissions to delete from ' + path);
            console.log('Try running the command as sudo.');
            console.log('');
            return;
        }
        const manager = new ClientManager();
        if (manager.removeUser(name)) {
            console.log('');
            console.log('Removed \'' + name + '\'.');
            console.log('');
        } else {
            console.log('');
            console.log('User \'' + name + '\' doesn\'t exist.');
            console.log('');
        }
    });
