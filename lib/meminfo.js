var fs = require('fs');

exports.meminfo = function meminfo(callback) {
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

var BYTEMAP = {
  'kB': 1024,
  'mB': 1024 * 1024,
  'gB': 1024 * 1024 * 1024,
};

exports.smaps = function smaps(pid, callback) {
  var fname = '/proc/self/smaps';

  if (typeof callback === 'undefined') {
    callback = pid;
    pid = process.pid;
  } else {
    fname = '/proc/' + pid + '/smaps';
  }

  fs.readFile(fname, 'utf8', function (err, data) {
    var results, last_group;

    if (err) {
      return callback(err);
    }

    results = {
      totals: {},
    };

    data.split(/\n/).forEach(function (line) {
      var parts = line.split(/\s+/), named, field;

      if (!line)
        return;

      if (parts[0].indexOf(':') != -1) {
        field = parts[0].replace(':', '').toLowerCase();

        last_group[field] = parts[1] + ' ' + parts[2]

        if (!results.totals[field]) {
          results.totals[field] = 0;
        }

        results.totals[field] += parts[1] * BYTEMAP[parts[2]];
      } else {
        last_group = {};
        last_group.region = parts[0];
        last_group.permissions = parts[1];
        last_group.offset = parts[2];
        last_group.device = parts[3];
        last_group.inode = parts[4];
        last_group.path = parts[5];

        if (!last_group.path) {
          last_group.path = '<unnamed>';
        }

        if (!last_group.path.match(/^\[(.*)\]$/)) {
          named = results[last_group.path];

          if (!named) {
            named = []
            results[last_group.path] = named;
          }

          named.push(last_group);
        } else {
          results[last_group.path.replace(/^\[(.*)\]$/, '$1')] = last_group;
        }
      }
    });

    Object.keys(results.totals).forEach(function(field) {
      var amt = results.totals[field], type;

      if (amt > BYTEMAP.gB) {
        amt = amt / BYTEMAP.gB;
        type = ' gB';
      } else if (amt > BYTEMAP.mB) {
        amt = amt / BYTEMAP.mB;
        type = ' mB';
      } else {
        amt = amt / BYTEMAP.kB;
        type = ' kB';
      }

      results.totals[field] = Math.round(amt * 100)/100 + type;
    });

    callback(null, results);
  });
}
