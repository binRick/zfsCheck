#!/usr/bin/env node

var c = require('chalk'),
    servers = ['cassi', 'enterprise'],
    _ = require('underscore'),
    fs = require('fs'),
    trim = require('trim'),
    pj = require('prettyjson'),
    Client = require('ssh2').Client;

var hosts = fs.readFileSync(__dirname + '/hosts.txt').toString().split('\n').map(function(h) {
    return trim(h);
}).filter(function(h) {
    return h.length > 0;
});

hosts = hosts.slice(0, 5);
console.log(pj.render(hosts));
//process.exit();

var cmd = 'zfs get -H -o value -p available tank';


_.each(hosts, function(server) {
    var conn = new Client();
    conn.on('ready', function() {
//        console.log(c.green('Connected to', server));
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
