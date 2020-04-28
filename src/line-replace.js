const fs = require('fs')
const util = require('util')
const readline = require('readline')
const stream = require('stream')
const rename = util.promisify(fs.rename)
const unlink = util.promisify(fs.unlink)

function lineReplace({ file, line, text, addNewLine = true, callback }) {
  const readStream = fs.createReadStream(file)
  const tempFile = `${file}.tmp`
  const writeStream = fs.createWriteStream(tempFile)
  const rl = readline.createInterface(readStream, stream)
  let replacedText

  readStream.on('error', async ({ message }) => {
    await unlink(tempFile)
    callback({ error: message, file, line, replacedText, text })
  })

  writeStream.on('error', async ({ message }) => {
    await unlink(tempFile)
    callback({ error: message, file, line, replacedText, text })
  })

  rl.on('error', async ({ message }) => {
    await unlink(tempFile)
    callback({ error: message, file, line, replacedText, text })
  })

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
    writeStream.end(async () => {
      try {
        await unlink(file) // Delete original file.
        await rename(tempFile, file) // Rename temp file with original file name.
      } catch (error) {
        callback({ error, file, line, replacedText, text })
        return
      }

      callback({ file, line, replacedText, text })
    })
  })
}

module.exports = lineReplace
