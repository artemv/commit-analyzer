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

  t.end()
})
