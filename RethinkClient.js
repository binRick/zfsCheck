#!/usr/bin/env node

var r = require('rethinkdb'),
    pj = require('prettyjson'),
    os = require('os'),
    fs = require('fs'),
    trim = require('trim'),
    child = require('child_process');

var vmFields = ['ctid', 'status', 'private'];
var cmd = '/usr/sbin/vzlist -ajo ' + vmFields.join(',');
var VMs = JSON.parse(child.execSync(cmd).toString());

//console.log(VMs);
//process.exit();

r.connect({
    host: process.env.rethinkHost,
    port: process.env.rethinkPort,
}, function(err, conn) {
    if (err) throw err;
    var Update = {
        os: {
            ts: new Date().getTime(),
            hostname: os.hostname(),
            networkInterfaces: os.networkInterfaces(),
            cpus: os.cpus().length,
            uptime: os.uptime(),
            loadavg: os.loadavg(),
            freemem: os.freemem(),
            totalmem: os.totalmem(),
            platform: os.platform(),
            kernel: os.release(),
            vms: VMs,
        }
    };
    console.log(pj.render(Update));

    r.dbCreate(process.env.rethinkDatabase).run(conn, function(err, result) {
        r.db(process.env.rethinkDatabase).tableCreate(process.env.rethinkTable).run(conn, function(err, result) {
            r.db(process.env.rethinkDatabase).table(process.env.rethinkTable).
            filter(r.row('hostname').eq(os.hostname())).update(Update).
            run(conn, function(err, res) {
                if (err) throw err;
                console.log(typeof(res));
                console.log(typeof(res['generated_keys']));
                console.log(typeof(res['_type']));
                if (typeof(res['errors']) == 'number') {
                    if (res['errors'] == 0) {

                        if (res['replaced'] == 0) {
                            r.db(process.env.rethinkDatabase).table(process.env.rethinkTable).
                            insert({
                                hostname: os.hostname(),
                            }).
                            run(conn, function(err, res) {
                                if (err) throw err;
                                console.log(res);
                            });

                        }
                    }
                }
                if (typeof(res['_type']) == 'number') {
                    console.log('query');
                    res.toArray(function(err, result) {
                        if (err) throw err;
                        console.log(JSON.stringify(result, null, 2));
                        process.exit();
                    });
                }
                if (typeof(res['generated_keys']) == 'object') {
                    console.log('inserted');
                    console.log(res);
                    process.exit();
                }
                console.log(res);
                process.exit();
            });
        });
    });
});