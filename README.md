# line-replace
Replace a line in a file with passed string.

## Install

Global, for command line usage:
`npm install -g line-replace`

Local, for programatic usage in your project:
`npm install --save line-replace`

## Command line usage

```
    USAGE:
      line-replace [file]:[line] [[string]]

    EXAMPLE:
      line-replace sample.txt:7 'New content for line seven.'


    Passed string will replace passed line number on passed file.
    If string is not provided, the line will be cleared.
```

## Programatic usage

```
const replaceLine = require('line-replace')
replaceLine({
  file: error.file,
  line: error.line,
  text: fixedString,
  onReplace
})

function onReplace({file, line, text, replacedText}) {

}

```

## Should it work with big files?

Yeah. `line-replace` uses read and write streams, so it should work ok with big files.

Enjoy!
