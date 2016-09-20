const { parseRawCommit } = require('conventional-changelog/lib/git')

const PATCH_VERSION = 'patch'
const MINOR_VERSION = 'minor'
const MAJOR_VERSION = 'major'
const TYPES_MAP = {
  chore: PATCH_VERSION,
  docs: PATCH_VERSION,
  feat: MINOR_VERSION,
  fix: PATCH_VERSION,
  perf: PATCH_VERSION,
  refactor: PATCH_VERSION,
  test: PATCH_VERSION
}

const DEFAULT_VERSION_TYPE = PATCH_VERSION
const DEFAULT_ALLOWED_VERSIONS = [PATCH_VERSION, MINOR_VERSION, MAJOR_VERSION]

module.exports = function (pluginConfig, {commits}, cb) {
  let type = null
  let allowedVersionTypes = pluginConfig.allowed || DEFAULT_ALLOWED_VERSIONS

  commits

  .map(commit => parseRawCommit(`${commit.hash}\n${commit.message}`))

  .every(commit => {
    console.log('commit:', commit)
    let commitType = null
    if (!commit) {
      commitType = DEFAULT_VERSION_TYPE
    } else if (commit.breaks.length && allowedVersionTypes.indexOf(MAJOR_VERSION) >= 0) {
      commitType = MAJOR_VERSION
    } else if (commit.type in TYPES_MAP) {
      commitType = TYPES_MAP[commit.type]
    }

    if (commitType && allowedVersionTypes.indexOf(commitType) < 0) {
      commitType = pluginConfig.fallback || DEFAULT_VERSION_TYPE
    }

    if (commitType === PATCH_VERSION) {
      type = type || commitType
    } else {
      if (commitType) type = commitType
    }
    let result = type !== MAJOR_VERSION
    console.log('result', result, type)
    return result
  })

  cb(null, type)
}
