const fs = require('fs')
const readline = require('readline')
const stream = require('stream')

function lineReplace ({file, line, text, addNewLine = true, callback}) {
  const readStream = fs.createReadStream(file)
  const tempFile = `${file}.tmp`
  const writeStream = fs.createWriteStream(tempFile)
  const rl = readline.createInterface(readStream, stream)
  let replacedText

  let currentLine = 0
  rl.on('line', (originalLine) => {
    ++currentLine

    // Replace.
    if (currentLine === line) {
      replacedText = originalLine
      if (addNewLine) return writeStream.write(`${text}\n`)
      return writeStream.write(`${text}`)
    }

    // Save original line.
    writeStream.write(`${originalLine}\n`)
  })

  rl.on('close', () => {
    // Finish writing to temp file and replace files.
    // Replace original file with fixed file (the temp file).
    writeStream.end(() => {
      try {
        fs.unlinkSync(file) // Delete original file.
        fs.renameSync(tempFile, file) // Rename temp file with original file name.
      } catch (e) {
        throw e
      }

      callback({file, line, replacedText, text})
    })
  })
}

module.exports = lineReplace
