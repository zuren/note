#!/usr/bin/env node

const { join } = require("path")
const home = require("user-home")
const touch = require("touch")
const minimist = require("minimist")
const openInEditor = require("open-in-editor")
const { yellow, grey, green, red } = require("chalk")

const NOTE_DIRECTORY = join(home, "notes")
const DEFAULT_EDITOR = "vim"

const error = err => {
  console.error(red(err))
  process.exit(1)
}

const help = () => {
  console.log(`
  ${grey("~~~~")} ${yellow("jot")} ${grey("~~~~")}

  ${grey(`notes are stored in ${NOTE_DIRECTORY}`)}

  ${grey(`set $EDITOR to your preferred editor`)}

  creating a new note:

  ${grey("$")} jot ${green("<note-name>")}

  editing an existing note:

  ${grey("$")} jot ${green("<note-name>")}
  `)

  process.exit(0)
}

const argv = minimist(process.argv.slice(2))
const [noteName] = argv._

if (argv.help) help()
if (noteName === undefined) help()

const notePath = join(NOTE_DIRECTORY, noteName)
const editor = openInEditor.configure({
  editor: process.env.EDITOR || DEFAULT_EDITOR,
}, error)

;(async () => {
  await touch(notePath)
  await editor.open(notePath)
})()
