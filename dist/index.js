'use strict';

var _require = require('conventional-changelog/lib/git');

var parseRawCommit = _require.parseRawCommit;

var typeMap = {
  chore: 'patch',
  docs: 'patch',
  feat: 'minor',
  fix: 'patch',
  perf: 'patch',
  refactor: 'patch',
  test: 'patch'
};

module.exports = function (pluginConfig, _ref, cb) {
  var commits = _ref.commits;

  var type = null;

  commits.map(function (commit) {
    return parseRawCommit(commit.hash + '\n' + commit.message);
  }).every(function (commit) {
    var commitType = null;
    if (!commit) {
      commitType = 'patch';
    } else if (commit.breaks.length) {
      commitType = 'major';
    } else if (commit.type in typeMap) {
      commitType = typeMap[commit.type];
    }

    if (commitType === 'patch') {
      type = type || commitType;
    } else {
      type = commitType;
    }
    return type !== 'major';
  });

  cb(null, type);
};