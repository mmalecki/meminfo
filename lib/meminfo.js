var fs = require('fs');

module.exports = function meminfo(callback) {
  var result = {};

  fs.readFile('/proc/meminfo', 'utf8', function (err, str) {
    if (err) {
      return callback(err);
    }

    str.split('\n').forEach(function (line) {
      var parts = line.split(':');
      if (parts.length === 2) {
        result[parts[0]] = parts[1].trim().split(' ', 1)[0];
      }
    });
    callback(null, result);
  });
};
