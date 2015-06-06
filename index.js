#!/usr/bin/env node

var dir = require('direktor'),
c = require('chalk');
var session = new dir.Session();
var servers = ['cassi', 'enterprise'];
var _ = require('underscore');



var Client = require('ssh2').Client;

_.each(servers, function(server) {
    /*
        var task = new dir.Task({
            host: server,
            port: 22,
            username: 'root',
            privateKey: require('fs').readFileSync('/root/.ssh/id_rsa')
        });
        task.before = 'zpool list tank';
        task.commands = 'zfs get -H -o value -p available tank';
    */

    var cmd = 'zfs get -H -o value -p available tank';

    var conn = new Client();
    conn.on('ready', function() {
        console.log(c.green('Connected to', server));
        conn.exec(cmd, function(err, stream) {
            if (err) throw err;
            stream.on('close', function(code, signal) {
                conn.end();
            }).on('data', function(data) {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', function(data) {
                console.log('STDERR: ' + data);
            });
        });
    }).connect({
        host: server,
        port: 22,
        username: 'root',
        privateKey: require('fs').readFileSync('/root/.ssh/id_rsa')
    });


    //    session.tasks.push(task);
});


//session.execute(function(err) {
//    console.log(err);
//});
