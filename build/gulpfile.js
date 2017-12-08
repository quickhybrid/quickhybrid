const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');
const gulpUglify = require('gulp-uglify');
const gulpEslint = require('gulp-eslint');
const gulpRename = require('gulp-rename');
const gulpHeader = require('gulp-header');
const babel = require('rollup-plugin-babel');
const eslint = require('rollup-plugin-eslint');
const pkg = require('../package.json');
const walkByRollup = require('./rollupbuild').walk;

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

gulp.task('build_main', () => walkByRollup([{
    input: resolvePath(`${SOURCE_ROOT_PATH}/index.js`),
    plugins: [
        eslint({
            exclude: 'node_modules/**',
        }),
        babel({
            exclude: 'node_modules/**',
            // rollup使用"transform-runtime"只能通过配置
            // 可以将所有的垫片函数集成到一起，避免重复冗余
            runtimeHelpers: true,
            // 使用class时，external-helpers会莫名其妙引入asyncGenerator
            // 而runtime不会
            // plugins: ['external-helpers'],
        }),
    ],
    output: {
        file: resolvePath(`${RELEASE_ROOT_PATH}/quick.js`),
    },
    format: 'umd',
    name: 'quick',
    banner,
    sourcemap: isSourceMap,
}]));

gulp.task('build_api', () => walkByRollup([{
    input: resolvePath(`${SOURCE_ROOT_PATH}/api/allh5.js`),
    plugins: [
        eslint({
            exclude: 'node_modules/**',
        }),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
        }),
    ],
    output: {
        file: resolvePath(`${RELEASE_ROOT_PATH}/quick.h5.js`),
    },
    format: 'umd',
    name: 'quick',
    banner,
    sourcemap: isSourceMap,
}, {
    input: resolvePath(`${SOURCE_ROOT_PATH}/api/allnative.js`),
    plugins: [
        eslint({
            exclude: 'node_modules/**',
        }),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
        }),
    ],
    output: {
        file: resolvePath(`${RELEASE_ROOT_PATH}/quick.native.js`),
    },
    format: 'umd',
    name: 'quick',
    banner,
    sourcemap: isSourceMap,
}]));

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

gulp.task('build', ['build_main', 'build_api', 'eslint_others']);

gulp.task('dist_js_uglify', () => gulp.src([
    resolvePath(`${RELEASE_ROOT_PATH}/**/*.js`),
    '!PATH'.replace('PATH', resolvePath(`${RELEASE_ROOT_PATH}/**/*.min.js`)),
])
    .pipe(gulpUglify())
    .on('error', (err) => {
        console.log('line number: %d, message: %s', err.lineNumber, err.message);
        this.end();
    })
    .pipe(gulpRename({
        suffix: '.min',
    }))
    .pipe(gulpHeader(banner))
    .pipe(gulp.dest(resolvePath(RELEASE_ROOT_PATH))));

gulp.task('dist', ['dist_js_uglify']);

gulp.task('default', (callback) => {
    gulpSequence('build', 'dist')(callback);
});

gulp.task('watch', () => {
    gulp.watch([
        resolvePath(`${SOURCE_ROOT_PATH}/**/*.js`),
        resolvePath('build/**/*.js'),
        resolvePath('test/**/*.js'),
    ], ['default']);
});