const { parseRawCommit } = require('conventional-changelog/lib/git')
const typeMap = {
  chore: 'patch',
  docs: 'patch',
  feat: 'minor',
  fix: 'patch',
  perf: 'patch',
  refactor: 'patch',
  test: 'patch'
}

module.exports = function (pluginConfig, {commits}, cb) {
  let type = null

  commits

  .map((commit) => parseRawCommit(`${commit.hash}\n${commit.message}`))

  .every((commit) => {
    let commitType = null
    if (!commit) {
      commitType = 'patch'
    } else if (commit.breaks.length) {
      commitType = 'major'
    } else if (commit.type in typeMap) {
      commitType = typeMap[commit.type]
    }

    if (commitType === 'patch') {
      type = type || commitType
    } else {
      type = commitType
    }
    return type !== 'major'
  })

  cb(null, type)
}
