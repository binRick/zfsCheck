#!/usr/bin/env node

    var c = require('chalk'),
    servers = ['cassi', 'enterprise'],
    _ = require('underscore'),
    Client = require('ssh2').Client;

var cmd = 'zfs get -H -o value -p available tank';

_.each(servers, function(server) {
    var conn = new Client();
    conn.on('ready', function() {
        console.log(c.green('Connected to', server));
        conn.exec(cmd, function(err, stream) {
            if (err) throw err;
            stream.on('close', function(code, signal) {
                conn.end();
            }).on('data', function(data) {
                console.log(c.black(server), c.red(data));
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
});
