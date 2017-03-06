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
const lineReplace = require('line-replace')
lineReplace({
  file: 'a-file.txt',
  line: 42,
  text: 'Answer to the Ultimate Question of Life, the Universe, and Everything.',
  addNewLine: true,
  onReplace
})

function onReplace({file, line, text, replacedText}) {

}

```

`addNewLine` defaults to `true`, which doesn't add or remove
lines from the original document.

Setting it to `false` is the equivalent of removing the passed line and appending
the passed text to the next line.

For example, with the following content:
```
First line.
Second line.
Third line.
```

Running:
```
lineReplace({
  file: 'the-file.txt',
  line: 2,
  text: 'LOOK: ',
  addNewLine: false,
  onReplace
})
```

Will result in:
```
First line.
LOOK: Third line.
```

## Should it work with big files?

Yeah. `line-replace` uses read and write streams, so it should work ok with big files.

Enjoy!
