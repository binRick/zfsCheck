#!/usr/bin/env node

var c = require('chalk'),
    async = require('async'),
    servers = ['cassi', 'enterprise'],
    _ = require('underscore'),
    fs = require('fs'),
    trim = require('trim'),
    pj = require('prettyjson'),
    Client = require('ssh2').Client;

var limit = 10;

var hosts = fs.readFileSync(__dirname + '/hosts.txt').toString().split('\n').map(function(h) {
    return trim(h);
}).filter(function(h) {
    return h.length > 0;
});
var LIM = process.argv[2] || 1;
hosts = hosts.slice(0, LIM);
//console.log(pj.render(hosts));
//process.exit();

var cmd = 'zfs get -H -o value -p available tank';

var tasks = [];
_.each(hosts, function(server) {
    tasks.push(
        function(callback) {
            var conn = new Client();
            var start = new Date().getTime();
            conn.on('ready', function() {
                var data = '';
                //                console.log(c.green('Connected to', server));
                conn.exec(cmd, function(err, stream) {
                    if (err) throw err;
                    stream.on('close', function(code, signal) {
                        conn.end();
                    }).on('data', function(data) {
                        data = data.toString();
                        callback(null, {
                            server: server,
                            cmd: cmd,
                            started: start,
                            millisecs: new Date().getTime() - start,
                            ts: new Date().getTime(),
                            data: trim(data),
                        });
                    }).stderr.on('data', function(data) {
                        console.log('STDERR: ' + data);
                        callback(data, null);
                    });
                });
            }).connect({
                host: server,
                port: 22,
                username: 'root',
                privateKey: require('fs').readFileSync('/root/.ssh/id_rsa')
            });
        }
    );
});

async.parallelLimit(tasks, limit, function(err, results) {
    if (err) throw err;
    console.log(results);
});
