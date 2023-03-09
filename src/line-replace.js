const fs = require('fs')
const util = require('util')
const readline = require('readline')
const stream = require('stream')
const rename = util.promisify(fs.rename)
const unlink = util.promisify(fs.unlink)

function lineReplace({ file, line, text, addNewLine = true, textToReplace }) {

  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(file)
    const tempFile = `${file}.tmp`
    const writeStream = fs.createWriteStream(tempFile)
    const rl = readline.createInterface(readStream, stream)

    let replacedText

    readStream.on('error', async ({ message }) => {
      await unlink(tempFile)
      reject({ error: message, file, line, replacedText, text })
    })

    writeStream.on('error', async ({ message }) => {
      await unlink(tempFile)
      reject({ error: message, file, line, replacedText, text })
    })

    rl.on('error', async ({ message }) => {
      await unlink(tempFile)
      reject({ error: message, file, line, replacedText, text })
    })

    let currentLine = 0
    rl.on('line', (originalLine) => {
      ++currentLine

      // Replace.
      if (currentLine === line) {
        let output;
        if (textToReplace) {
          replacedText = textToReplace
          output = originalLine.replace(textToReplace, text)
        } else {
          replacedText = originalLine
          output = text
        }
        if (addNewLine) return writeStream.write(`${output}\n`)
        return writeStream.write(`${output}`)
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
          reject({ error, file, line, replacedText, text })
        }

        resolve({ file, line, replacedText, text })
      })
    })
  });
}

module.exports = lineReplace
