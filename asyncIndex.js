#!/usr/bin/env node

var c = require('chalk'),
r = require('rethinkdb'),
status = require('node-status'),
    async = require('async'),
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
hosts = [LIM];
var Commands = require('./Commands.js')[process.argv[3] || 'zfsInfo'];

var tasks = [];

var Cmds = status.addItem("command", {
  type: ['bar','percentage'],
  max: Commands.length
});
status.start();

r.connect({
    host: process.env.rethinkHost,
    port: process.env.rethinkPort,
}, function(err, conn) {
    if (err) throw err;

_.each(Commands, function(Command) {
    var cmd = Command.cmd;
    _.each(hosts, function(server) {
        tasks.push(
            function(callback) {
                var conn = new Client();
                var start = new Date().getTime();
Cmds.inc();
                conn.on('ready', function() {
                    var data = '';
                    //                console.log(c.green('Connected to', server));
                    conn.exec(cmd, function(err, stream) {
                        if (err) throw err;
                        stream.on('close', function(code, signal) {
                            conn.end();
                        }).on('data', function(data) {
                            data = trim(data.toString());
                            if (typeof(Command.process) == 'function')
                                data = Command.process(data);
                            callback(null, {
                                server: server,
                                cmd: cmd,
                                key: Command.key,
                                title: Command.title,
                                started: start,
                                millisecs: new Date().getTime() - start,
                                ts: new Date().getTime(),
                                data: data,
                            });
                        }).stderr.on('data', function(data) {
                            console.log(c.red.bgWhite('STDERR: ' + data));
//                            callback(data, null);
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
    if (process.argv[4] == '--server') {

        var express = require('express');
        var app = new express();

        app.get('/', function(req, res) {
            res.end('holla');
        });

        app.get('/hosts', function(req, res) {
            res.json(_.uniq(_.pluck(results, 'server')));
        });
/*
        app.get('/sethost/:host/:key/:val', function(req, res) {


            var R = _.where(results, {
                server: req.params.host
            });
R[req.params.key] = req.params.val;

    r.dbCreate(process.env.rethinkDatabase).run(conn, function(err, result) {
        r.db(process.env.rethinkDatabase).tableCreate(process.env.rethinkTable).run(conn, function(err, result) {
            r.db(process.env.rethinkDatabase).table(process.env.rethinkTable).
            filter(r.row('hostname').eq(req.params.host)).update(R).
            run(conn, function(err, res) {
                if (err) throw err;
            res.json(R);
});
        });
});
});*/
        app.get('/host/:host', function(req, res) {
            var R = _.where(results, {
                server: req.params.host
            });
            res.json(R);
        });

        app.listen(process.env.PORT || 31992);

    }else
	process.exit();
});
});
});
