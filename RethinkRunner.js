#!/usr/bin/env node
pj = require('prettyjson');
var r = require('rethinkdb');

var connection = null;
r.connect({
    host: 'localhost',
    port: 28015
}, function(err, conn) {
    if (err) throw err;
    connection = conn;


   r.db(process.env.rethinkDatabase).table(process.env.rethinkTable).changes().run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.each(function(err, row) {
            if (err) throw err;
console.log(pj.render(row));
//            console.log(JSON.stringify(row, null, 2));
        });
    });

});
