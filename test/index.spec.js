const {expect} = require('chai')
const fs = require('fs')
const {resolve} = require('path')
const exec = require('child_process').exec
const indexFile = resolve('bin/index.js')
const testFile = resolve('test/test.txt')
let testFileContent

describe('command-line api', () => {
  beforeEach(resetTestFile)

  it('should replace text on first line', (done) => {
    exec(`node ${indexFile} ${testFile}:1 'Hi there!'`, () => {
      const fileData = fs.readFileSync(testFile, {encoding: 'utf8'})
      expect(fileData).to.equal(testFileContent.replace('First line.', 'Hi there!'))
      done()
    })
  })

  it('should set text on an empty line', (done) => {
    exec(`node ${indexFile} ${testFile}:3 "Let's rock!"`, () => {
      const fileData = fs.readFileSync(testFile, {encoding: 'utf8'})
      expect(fileData).to.equal(testFileContent.replace('This kinda works!\n', `This kinda works!\nLet's rock!`))
      done()
    })
  })

  it('should clear a non empty line', (done) => {
    exec(`node ${indexFile} ${testFile}:2`, () => {
      const fileData = fs.readFileSync(testFile, {encoding: 'utf8'})
      expect(fileData).to.equal(testFileContent.replace('This kinda works!', ''))
      done()
    })
  })
})

function resetTestFile () {
  testFileContent = `First line.
This kinda works!

Here, another one.
And... Some more text.

Bye!
`

  // Set initial content on test file.
  fs.writeFileSync(testFile, testFileContent)
}
