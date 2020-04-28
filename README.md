# line-replace

Replace a line in a file with passed string.

[![Build Status](https://travis-ci.org/codealchemist/line-replace.svg?branch=master)](https://travis-ci.org/codealchemist/line-replace)

## Install

Global, for command line usage:
`npm i -g line-replace`

Local, for programatic usage in your project:
`npm i line-replace`

## Command line usage

```
    USAGE:
      line-replace [file]:[line] [[string]]

    EXAMPLE:
      line-replace sample.txt:7 'New content for line seven.'


    Passed string will replace passed line number on passed file.
    If string is not provided, the line will be cleared.
```

You can also use it directly with `npx`:

`npx line-replace [file]:[line] [[string]]`

For example:

`npx line-replace test.txt:1 'HEY!'`

Note that **line numbers start at 1**.

## Programatic usage

```
const lineReplace = require('line-replace')
lineReplace({
  file: 'a-file.txt',
  line: 42,
  text: 'Answer to the Ultimate Question of Life, the Universe, and Everything.',
  addNewLine: true,
  callback: ({ file, line, text, replacedText, error }) => {}
})
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
  callback: ({file, line, text, replacedText, error}) => {}
})
```

Will result in:

```
First line.
LOOK: Third line.
```

## Should it work with big files?

Yeah. `line-replace` uses read and write streams, so it should work ok with big files.

## Changelog

### v2.0

- FS sync methods replaced with async + [utils.promisify](https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original) (added in Node v8).
- Passing errors to callback.
