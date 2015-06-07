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
module.exports.Checkin = [{
    key: 'installZfsCheck',
    'title': 'Install zfsCheck',
    cmd: 'cd /root/zfsCheck && ./RethinkClient.js checking hello',
    process: function(stdOut) {
        return stdOut.split('\n');
    }
}];
module.exports.Hammer = [{
    key: 'installZfsCheck',
    'title': 'Install zfsCheck',
    cmd: 'cd /root && rm -rf zfsCheck && wget -O zfsCheck.zip https://github.com/binRick/zfsCheck/archive/master.zip && unzip zfsCheck.zip && mv zfsCheck-master zfsCheck && unlink /root/zfsCheck.zip && cd /root/zfsCheck && npm install 2>/dev/null',
    cmd1: 'cd /root/zfsCheck || git clone https://github.com/binRick/zfsCheck || rsync -vare ssh beo:/root/zfsCheck /root',
    //cd /root && ls zfsCheck || git clone https://github.com/binRick/zfsCheck',
    process: function(stdOut) {
        return stdOut.split('\n');
    }
}];
