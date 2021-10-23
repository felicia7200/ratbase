// import gulp and plugins
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

const sources = [
	'./index.js', 
	'./commands/*.js', 
	'./events/**/*.js', 
	'./handlers/*.js', 
	'./models/*.js'
];

// eslint on server code
const lintTask = (done) => {
  gulp.src(sources)
  .pipe(plumber())
  .pipe(eslint({ fix: true }))
  // format makes the output readable
  .pipe(eslint.format())
  // if there is an error, stop the task
  .pipe(eslint.failAfterError())
  
  done();
};

// create a watch script
const watch = () => {  
  // check for changhes in js files, then run lintTask
  for(let i = 0; i < sources.length; i++)
	  gulp.watch(sources[i], lintTask);
  
  // set up nodemon so it restarts the server on a change on any file
  nodemon({
	script: './index.js',
	ignore: ['node_modules/'],
	ext: 'js'
  });
};


// export the watch script for use in package.json
module.exports.watch = watch;
module.exports.build = lintTask;