const { test } = require('tap')

const analyzer = require('../../dist')

test('derive version number from commits', (t) => {
  t.test('style -> no release', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'asdf',
        message: 'style: switch to JS standard style'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, null)
    })
  })

  t.test('chore -> patch release', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'asdf',
        message: 'chore(travis): add email notifications'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'patch')
    })
  })

  t.test('docs -> patch release', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'asdf',
        message: 'docs(badges): add standard badge'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'patch')
    })
  })

  t.test('perf -> patch release', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'asdf',
        message: 'perf: v8 is awesome'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'patch')
    })
  })

  t.test('fix -> patch release', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'asdf',
        message: 'fix: nasty bug'
      }, {
        hash: '1234',
        message: 'fix(scope): even nastier bug'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'patch')
    })
  })

  t.test('refactor -> patch release', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'asdf',
        message: 'refactor: drop constructors, use functions & delegation'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'patch')
    })
  })

  t.test('minor/feature version', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'asdf',
        message: 'fix: nasty bug'
      }, {
        hash: '1234',
        message: 'feat(scope): cool feature'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'minor')
    })
  })

  t.test('minor/feature version, if the last commit was fix', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'asdf',
        message: 'fix: nasty bug'
      }, {
        hash: '1234',
        message: 'feat(scope): cool feature'
      }, {
        hash: 'asdf',
        message: 'fix: another nasty bug'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'minor')
    })
  })

  t.test('major/breaking version', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'qwer',
        message: 'feat(something): even cooler feature\nBREAKING CHANGE: everything so broken'
      }, {
        hash: '1234',
        message: 'feat(scope): cool feature'
      }, {
        hash: 'asdf',
        message: 'fix: nasty bug'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'major')
    })
  })

  t.test('unstructured -> patch release', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'asdf',
        message: 'add email notifications yo'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'patch')
    })
  })

  t.test('revert -> patch release', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'asdf',
        message: 'revert: some other commit'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'patch')
    })
  })

  t.test('major/breaking version disallowed, fallback not specified', (tt) => {
    tt.plan(2)

    analyzer({allowed: ['patch', 'minor']}, {
      commits: [{
        hash: 'qwer',
        message: 'feat(something): even cooler feature\nBREAKING CHANGE: everything so changed'
      }, {
        hash: 'asdf',
        message: 'fix: nasty bug'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'minor')
    })
  })

  t.test('patch version disallowed, fallback specified', (tt) => {
    tt.plan(2)

    analyzer({allowed: ['minor', 'major'], fallback: 'minor'}, {
      commits: [{
        hash: 'qwer',
        message: 'chore(something): some stuff'
      }, {
        hash: 'asdf',
        message: 'fix: nasty bug'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'minor')
    })
  })

  t.test('feat version disallowed, fallback not specified', (tt) => {
    tt.plan(2)

    analyzer({allowed: ['patch', 'major']}, {
      commits: [{
        hash: 'qwer',
        message: 'feat(something): even cooler feature'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'patch')
    })
  })

  t.test('feat + style -> minor', (tt) => {
    tt.plan(2)

    analyzer({}, {
      commits: [{
        hash: 'qwer',
        message: 'feat(something): even cooler feature'
      }, {
        hash: 'asdf',
        message: 'style: switch to JS standard style'
      }]
    }, (err, type) => {
      tt.error(err)
      tt.is(type, 'minor')
    })
  })

  t.end()
})
