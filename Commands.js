module.exports.Commands = [
{
        key: 'availableBytes',
        'title': 'Available Bytes',
        cmd1: 'zfs get -H -o value -p available tank',
        cmd: 'cd /root && ls zfsCheck || git clone https://github.com/binRick/zfsCheck',
        process: function(stdOut) {
            return stdOut.split('\n');
        },
    },
{
        key: 'availableBytes',
        'title': 'Available Bytes',
        cmd: 'cd /root/zfsCheck && stat RethinkClient.js | grep Modify',
        process: function(stdOut) {
            return stdOut.split('\n');
        },
    },


];
