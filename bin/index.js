#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const lineReplace = require(path.join(__dirname, '../src/replace-line.js'))
const args = process.argv.slice(2)

// Print ascii art.
var artFile = path.join(__dirname, '../src/ascii-art.txt')
var art = fs.readFileSync(artFile, 'utf8')
console.log(art)

// At least file:line must be provided.
if (args.length === 0 || args.length > 2) showUsage()

// Get file and line.
const matches = args[0].match(/(.+):(.+)/)

// If unable to get a file:line show usage.
if (!matches || !matches.length) showUsage()

// Set params.
const file = matches[1]
const line = parseInt(matches[2], 10)
const text = args[1] || ''

// Replace.
lineReplace({
  file,
  line,
  text,
  callback: onReplace
})

function onReplace (data) {
  if (data.text === data.replacedText) displayResult('noChanges', data)
  if (!data.text) displayResult('lineCleared', data)
  if (!data.replacedText) displayResult('blankLineReplaced', data)
  displayResult('changed', data)
}

function displayResult (type, data) {
  const message = getResultMessage(type, data)
  console.log(message)
  process.exit()
}

function getResultMessage (type, data) {
  const fileLine = `${data.file}:${data.line}`

  const blankLineReplaced = `
  A blank line on '${fileLine}'
  was replaced with:
  ${data.text}
  `
  const noChanges = `
  No changes to '${fileLine}'.
  `
  const lineCleared = `
  The line was cleared:
  ${fileLine}

  Previous content:
  ${data.replacedText}
  `
  const changed = `
  The content on '${fileLine}':
  ${data.replacedText}

  was replaced with:
  ${data.text}
  `

  const messages = {
    blankLineReplaced,
    noChanges,
    lineCleared,
    changed
  }

  return messages[type]
}

function showUsage () {
  console.log(`
    USAGE:
      line-replace [file]:[line] [[string]]

    EXAMPLE:
      line-replace sample.txt:7 'New content for line seven.'


    Passed string will replace passed line number on passed file.
    If string is not provided, the line will be cleareed.
  `)
  process.exit()
}
