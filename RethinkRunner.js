#!/usr/bin/env node

var r = require('rethinkdb');

var connection = null;
r.connect({
    host: 'localhost',
    port: 28015
}, function(err, conn) {
    if (err) throw err;
    connection = conn;


    r.table('authors1').changes().run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.each(function(err, row) {
            if (err) throw err;
console.log(row);
//            console.log(JSON.stringify(row, null, 2));
        });
    });

});
