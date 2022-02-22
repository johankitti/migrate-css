#! /usr/bin/env node
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var _console = console,
    log = _console.log;

var _process$argv = _toArray(process.argv),
    args = _process$argv.slice(2);

var _args = _slicedToArray(args, 1),
    path = _args[0];

var configFile = _fs2.default.readFileSync('migrate-css.json');

var _JSON$parse = JSON.parse(configFile),
    fileTypesToRun = _JSON$parse.fileTypes,
    filesToIgnore = _JSON$parse.ignores,
    replaceDict = _JSON$parse.replaces;

console.log('Running migrate-css on file-types: ' + fileTypesToRun.join(', '));

var REACT_LIFECYCLE_METHODS = ['render', 'componentDidMount'];

var findAllFiles = function findAllFiles(dir, filelist, ignores, fileTypes) {
  var fs = fs || require('fs'),
      files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function (file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = findAllFiles(dir + '/' + file, filelist, ignores, fileTypes);
    } else {
      var fileName = dir + '/' + file;
      if (fileTypes.some(function (fileType) {
        return file.endsWith(fileType);
      }) && !ignores.some(function (ignore) {
        return fileName.startsWith(ignore);
      })) {
        filelist.push(fileName);
      }
    }
  });
  return filelist;
};

var fileList = findAllFiles(path, [], filesToIgnore, fileTypesToRun);

console.log('Found ' + fileList.length + ' files');

fileList.forEach(function (file) {
  var buffer = _fs2.default.readFileSync(file);
  var fileContent = buffer.toString();
  var oldFileContent = fileContent;
  Object.keys(replaceDict).map(function (replaceKey) {
    fileContent = fileContent.split(replaceKey).join(replaceDict[replaceKey]);
  });

  _fs2.default.writeFile(file, fileContent, function () {
    if (fileContent != oldFileContent) {
      console.log('Replaced contents of ' + file);
    }
  });
});