#!/usr/bin/env node

var r = require('rethinkdb');

var connection = null;
r.connect({
    host: 'localhost',
    port: 28015
}, function(err, conn) {
    if (err) throw err;
    connection = conn;


r.table('authors1').filter(r.row('name').eq('William Adama')).run(connection, function(err, cursor) {
    if (err) throw err;
    cursor.toArray(function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    });
});
});
