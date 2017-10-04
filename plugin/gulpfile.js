var gulp = require('gulp');
var _ = require('lodash');
var path = require('path');
var gutil = require('gulp-util');
var mkdirp = require('mkdirp');
var Rsync = require('rsync');
var Promise = require('bluebird');
var eslint = require('gulp-eslint');
var del = require('del');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var fs = require('fs');

var pkg = require('./package.json');
var packageName = pkg.name  + '-' + pkg.version;

// relative location of Kibana install
var pathToKibana = '../kibana';

var buildDir = path.resolve(__dirname, 'build');
var targetDir = path.resolve(__dirname, 'target');
var buildTarget = path.resolve(buildDir, pkg.name);
var kibanaPluginDir = path.resolve(__dirname, pathToKibana, 'plugins', pkg.name);

var include = [
  'package.json',
  'index.js',
  'node_modules',
  'public',
  'webpackShims',
  'server'
];

var exclude = [
  '.git',
  'gulpfile.js',
  '.eslintrc'
];

Object.keys(pkg.devDependencies).forEach(function (name) {
  exclude.push(path.join('node_modules', name));
});

function syncPluginTo(dest, done) {
  mkdirp(dest, function (err) {
    if (err) return done(err);

    var source = path.resolve(__dirname) + '/';
    var rsync = new Rsync();

    rsync.source(source)
        .destination(dest)
        .flags('uav')
        .recursive(true)
        .set('delete')
        .include(include)
        .exclude(exclude)
        .output(function (data) {
          process.stdout.write(data.toString('utf8'));
        });

    rsync.execute(function (err) {
      if (err) {
        console.log(err);
        return done(err);
      }
      done();
    });
  });
}

gulp.task('sync', function (done) {
  syncPluginTo(kibanaPluginDir, done);
});

gulp.task('lint', function (done) {
  var filePaths = [
    'gulpfile.js',
    'server/**/*.js',
    'public/**/*.js',
    'public/**/*.jsx',
  ];

  return gulp.src(filePaths)
  // eslint() attaches the lint output to the eslint property
  // of the file object so it can be used by other modules.
      .pipe(eslint())
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.formatEach())
      // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failOnError last.
      .pipe(eslint.failOnError());
});

gulp.task('test', ['lint'], function () {
  gutil.log(gutil.colors.red('Nothing to test...'));
});

gulp.task('clean', function () {
  return del([buildDir, targetDir]);
});

gulp.task('build', ['clean'], function (done) {
  syncPluginTo(buildTarget, done);
});

gulp.task('package', ['build'], function (done) {
  return gulp.src(path.join(buildDir, '**', '*'))
      .pipe(tar(packageName + '.tar'))
      .pipe(gzip())
      .pipe(gulp.dest(targetDir));
});

gulp.task('trickKibana', function (done) {
  const kibanaPackage = require(pathToKibana + '/package.json');
  if (pkg.version !== kibanaPackage.version) {
    const json = JSON.stringify(Object.assign({}, pkg, { version: kibanaPackage.version }, null, ' '));
    fs.writeFile(kibanaPluginDir + '/package.json', json, done);
  } else {
    done();
  }
});

gulp.task('dev', ['sync'], function (done) {
  const paths = [
    'package.json',
    'index.js',
    'public/**/*',
    'server/**/*'
  ];
  gulp.watch(paths, ['sync']);
});

gulp.task('default', ['sync', 'trickKibana']);


