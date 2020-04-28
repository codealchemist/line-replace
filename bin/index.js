#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const lineReplace = require(path.join(__dirname, '../src/line-replace.js'))
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

function onReplace(data) {
  const { text, replacedText, error } = data
  if (error) {
    displayResult('error', data)
    return
  }
  if (text === replacedText) displayResult('noChanges', data)
  if (!text) displayResult('lineCleared', data)
  if (!replacedText) displayResult('blankLineReplaced', data)
  displayResult('changed', data)
}

function displayResult(type, data) {
  const message = getResultMessage(type, data)
  console.log(message)
  process.exit()
}

function getResultMessage(type, data) {
  const { file, line, text, replacedText, error } = data
  const fileLine = `${file}:${line}`

  const blankLineReplaced = `
  A blank line on '${fileLine}'
  was replaced with:
  ${text}
  `
  const noChanges = `
  No changes to '${fileLine}'.
  `
  const lineCleared = `
  The line was cleared:
  ${fileLine}

  Previous content:
  ${replacedText}
  `
  const changed = `
  The content on '${fileLine}':
  ${replacedText}

  was replaced with:
  ${text}
  `

  const error = `
  Replacement on '${fileLine}' FAILED:
  ${error.message}
  `

  const messages = {
    blankLineReplaced,
    noChanges,
    lineCleared,
    changed,
    error
  }

  return messages[type]
}

function showUsage() {
  console.log(`
    USAGE:
      line-replace [file]:[line] [[string]]

    EXAMPLE:
      line-replace sample.txt:7 'New content for line seven.'


    Passed string will replace passed line number on passed file.
    If string is not provided, the line will be cleared.
  `)
  process.exit()
}
