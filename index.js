#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
let moduleName = ''
let checkname = process.argv && process.argv[2]
if (!checkname) return console.log('目录名不能为空')
moduleName = checkname

function mkdir(path, fn) {
  fs.mkdir(path, function(err) {
    fn && fn()
  })
}

function checkDirectory(src, dst, callback) {
  fs.access(dst, fs.constants.F_OK, err => {
    if (err) {
      fs.mkdirSync(dst)
      callback(src, dst)
    } else {
      callback(src, dst)
    }
  })
}

function copy(src, dst) {
  let paths = fs.readdirSync(src)
  paths.forEach(function(path) {
    var _src = src + '/' + path
    var _dst = dst + '/' + path
    fs.stat(_src, function(err, stats) {
      if (err) throw err
      if (stats.isFile()) {
        let readable = fs.createReadStream(_src)
        let writable = fs.createWriteStream(_dst)
        readable.pipe(writable)
      } else if (stats.isDirectory()) {
        checkDirectory(_src, _dst, copy)
      }
    })
  })
}

const PATH = path.resolve('./')
const templatePath = path.resolve('./node_modules/uniqueway-generator/template')
mkdir(PATH + '/modules', function() {
  mkdir(PATH + `/modules/${moduleName}`, function() {
    checkDirectory(templatePath, PATH + `/modules/${moduleName}`, copy)
  })
})
