#! /usr/bin/env node

import fs from 'fs'

const { log } = console
const [, , ...args] = process.argv
const [path] = args

const configFile = fs.readFileSync('migrate-css.json')
const { fileTypes: filesTypesToRun, ignores: filesToIgnore, replaces: replaceDict } = JSON.parse(configFile)
console.log(JSON.parse(configFile))
const REACT_LIFECYCLE_METHODS = ['render', 'componentDidMount']

const findAllFiles = (dir, filelist, ignores, fileTypes) => {
  var fs = fs || require('fs'),
    files = fs.readdirSync(dir)
  filelist = filelist || []
  files.forEach((file) => {
    if (fs.statSync(`${dir}/${file}`).isDirectory()) {
      filelist = findAllFiles(`${dir}/${file}`, filelist, ignores, fileTypes)
    } else {
      const fileName = `${dir}/${file}`
      if (fileTypes.some((fileType) => file.endsWith(fileType)) && !ignores.some((ignore) => fileName.startsWith(ignore))) {
        filelist.push(fileName)
      }
    }
  })
  return filelist
}

const fileList = findAllFiles(path, [], filesToIgnore, filesTypesToRun)

fileList.forEach((file) => {
  const buffer = fs.readFileSync(file)
  let fileContent = buffer.toString()
  const oldFileContent = fileContent
  Object.keys(replaceDict).map((replaceKey) => {
    fileContent = fileContent.split(replaceKey).join(replaceDict[replaceKey])
  })

  fs.writeFile(file, fileContent, () => {
    if (fileContent != oldFileContent) {
      console.log(`Replaced contents of ${file}`)
    }
  })
})
