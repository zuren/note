#!/usr/bin/env node

const { join } = require("path")
const { readdirSync } = require("fs")
const home = require("user-home")
const touch = require("touch")
const minimist = require("minimist")
const mkdirp = require("mkdirp")
const openInEditor = require("open-in-editor")
const { yellow, grey, green, red } = require("chalk")
const omelette = require("omelette")

const NOTE_DIRECTORY = join(home, "notes")
const DEFAULT_EDITOR = "vim"

const completion = omelette(`note <note-name>`)

completion.on("note-name", async ({ reply }) => {
  const files = readdirSync(NOTE_DIRECTORY)
  reply(files)
})

completion.init()

const setup = async () => {
  await mkdirp(NOTE_DIRECTORY)
  completion.setupShellInitFile()
  process.exit(0)
}

const error = err => {
  console.error(red(err))
  process.exit(1)
}

const help = () => {
  console.log(`
  ${grey("~~~~")} ${yellow("note")} ${grey("~~~~")}

  ${grey(`notes are stored in ${NOTE_DIRECTORY}`)}

  ${grey(`set $EDITOR to your preferred editor`)}

  setting up:

  ${grey("$")} export EDITOR=code
  ${grey("$")} note --setup

  creating a new note:

  ${grey("$")} note ${green("<note-name>")}

  editing an existing note:

  ${grey("$")} note ${green("<note-name>")}
  `)

  process.exit(0)
}

const argv = minimist(process.argv.slice(2))
const [noteName] = argv._

;(async () => {
  if (argv.setup) await setup()
  if (argv.help) help()
  if (noteName === undefined) help()

  const notePath = join(NOTE_DIRECTORY, noteName)
  const editor = openInEditor.configure({
    editor: process.env.EDITOR || DEFAULT_EDITOR,
  }, error)

  await touch(notePath)
  await editor.open(notePath)
})()
