const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const babel = require('rollup-plugin-babel');
const eslint = require('rollup-plugin-eslint');
const gulpEslint = require('gulp-eslint');
const pkg = require('../package.json');
const buildByRollup = require('./rollupbuild').build;

const banner = ['/*!',
    ' * <%= pkg.name %> v<%= pkg.version %>',
    ' * (c) 2017-<%= date %> <%= pkg.author %>',
    ' * Released under the <%= pkg.license %> License.',
    ' * <%= pkg.homepage %>',
    ' */',
    '',
].join('\n').replace(/<%=\s([^%]+)\s%>/g, ($0, $1) => ($1 === 'date' ? new Date().getFullYear() : (pkg[$1.split('.')[1]] || '')));

const RELEASE_ROOT_PATH = 'dist';
const SOURCE_ROOT_PATH = 'src';
const isSourceMap = false;

function resolvePath(p) {
    return path.resolve(__dirname, '../', p);
}

if (!fs.existsSync(resolvePath(RELEASE_ROOT_PATH))) {
    fs.mkdirSync(resolvePath(RELEASE_ROOT_PATH));
}

gulp.task('build_source', () => buildByRollup({
    input: resolvePath(`${SOURCE_ROOT_PATH}/index.js`),
    plugins: [
        eslint({
            exclude: 'node_modules/**',
        }),
        babel({
            // only transpile our source code
            exclude: 'node_modules/**',
        }),
    ],
    // uglify在build中自动进行
    output: {
        file: resolvePath(`${RELEASE_ROOT_PATH}/quickhybrid.js`),
    },
    format: 'umd',
    name: 'quick',
    banner,
    sourcemap: isSourceMap,
}));    

gulp.task('build_dist', () => buildByRollup({
    input: resolvePath(`${SOURCE_ROOT_PATH}/index.js`),
    plugins: [
        babel({
            // only transpile our source code
            exclude: 'node_modules/**',
        }),
    ],
    // uglify在build中自动进行
    output: {
        file: resolvePath(`${RELEASE_ROOT_PATH}/quickhybrid.min.js`),
    },
    format: 'umd',
    name: 'quick',
    banner,
    sourcemap: isSourceMap,
}));

// eslint代码检查打包文件以外的文件
gulp.task('eslint_others', () => gulp.src([
    resolvePath('build/**/*.js'),
    resolvePath('test/**/*.js'),
    // 主动ignore
    `!${resolvePath('test/inner/promise.js')}`,
])
    .pipe(gulpEslint())
    .pipe(gulpEslint.format()));
// 开启后如果报错会退出
// .pipe(gulpEslint.failAfterError());

gulp.task('build', ['build_source', 'build_dist', 'eslint_others']);

// 看守
gulp.task('watch', () => {
    // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
    //  gulp.watch([config.src+'/gulpWatch.json']).on('change', function(file) {
    //      console.log("改动");
    //  });
    gulp.watch([
        resolvePath(`${SOURCE_ROOT_PATH}/**/*.js`),
        resolvePath('build/**/*.js'),
        resolvePath('test/**/*.js'),
    ], ['build']);
});