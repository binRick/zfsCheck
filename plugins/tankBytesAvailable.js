module.exports.Key = 'tankBytesAvailable';
module.exports.FrequencySeconds = 120;
module.exports.Cmd = 'zfs get -H -o value -p available tank';
module.exports.Title = 'Bytes available in tank pool';
module.exports.Validator = function(s){
	return true;
};
