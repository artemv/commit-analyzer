'use strict';

var _require = require('conventional-changelog/lib/git');

var parseRawCommit = _require.parseRawCommit;

var PATCH_VERSION = 'patch';
var MINOR_VERSION = 'minor';
var MAJOR_VERSION = 'major';
var TYPES_MAP = {
  chore: PATCH_VERSION,
  docs: PATCH_VERSION,
  feat: MINOR_VERSION,
  fix: PATCH_VERSION,
  perf: PATCH_VERSION,
  refactor: PATCH_VERSION,
  test: PATCH_VERSION
};

var DEFAULT_VERSION_TYPE = PATCH_VERSION;
var DEFAULT_ALLOWED_VERSIONS = [PATCH_VERSION, MINOR_VERSION, MAJOR_VERSION];

module.exports = function (pluginConfig, _ref, cb) {
  var commits = _ref.commits;

  var type = null;
  var allowedVersionTypes = pluginConfig.allowed || DEFAULT_ALLOWED_VERSIONS;

  commits.map(function (commit) {
    return parseRawCommit(commit.hash + '\n' + commit.message);
  }).every(function (commit) {
    var commitType = null;
    if (!commit) {
      commitType = DEFAULT_VERSION_TYPE;
    } else if (commit.breaks.length && allowedVersionTypes.indexOf(MAJOR_VERSION) >= 0) {
      commitType = MAJOR_VERSION;
    } else if (commit.type in TYPES_MAP) {
      commitType = TYPES_MAP[commit.type];
    }

    if (commitType && allowedVersionTypes.indexOf(commitType) < 0) {
      commitType = pluginConfig.fallback || DEFAULT_VERSION_TYPE;
    }

    if (commitType === PATCH_VERSION) {
      type = type || commitType;
    } else {
      type = commitType;
    }
    return type !== MAJOR_VERSION;
  });

  cb(null, type);
};