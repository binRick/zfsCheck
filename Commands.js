module.exports.zfsInfo = [{
        key: 'availableBytes',
        'title': 'Available Bytes',
        cmd: 'zfs get -H -o value -p available tank',
    }, {
        key: 'poolHealth',
        'title': 'Pool Health',
        cmd: 'zpool get -H -p health tank',
        process: function(stdOut) {
            return stdOut.split('\t')[2];
        },
    }, {
        key: 'filesystems',
        'title': 'Filesystems',
        cmd: 'zfs list -H -o name -p | grep ^tank/ | grep ^tank/Snapshots/ -v',
        process: function(stdOut) {
            return stdOut.split('\n');
        },
    }];
module.exports.Install = [];
        //cmd: 'cd /root && ls zfsCheck || git clone https://github.com/binRick/zfsCheck',
