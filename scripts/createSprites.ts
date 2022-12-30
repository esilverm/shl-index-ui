import gulp from 'gulp';
import svgSprite from 'gulp-svg-sprite';

gulp
  .src('./public/team_logos/IIHF/*.svg')
  .pipe(
    svgSprite({
      shape: {
        dimension: {
          precision: 3,
        },
        transform: ['svgo'],
      },
      mode: {
        stack: {
          dest: '../public/stack/',
          sprite: 'iihf.stack.svg',
        },
      },
    }),
  )
  .pipe(gulp.dest('./public/'));

gulp
  .src('./public/team_logos/SHL/*.svg')
  .pipe(
    svgSprite({
      shape: {
        dimension: {
          precision: 3,
        },
        transform: ['svgo'],
      },
      mode: {
        stack: {
          dest: '../public/stack/',
          sprite: 'shl.stack.svg',
        },
      },
    }),
  )
  .pipe(gulp.dest('./public/'));

gulp
  .src('./public/team_logos/SMJHL/*.svg')
  .pipe(
    svgSprite({
      shape: {
        dimension: {
          precision: 3,
        },
        transform: ['svgo'],
      },
      mode: {
        stack: {
          dest: '../public/stack/',
          sprite: 'smjhl.stack.svg',
        },
      },
    }),
  )
  .pipe(gulp.dest('./public/'));

gulp
  .src('./public/team_logos/WJC/*.svg')
  .pipe(
    svgSprite({
      shape: {
        dimension: {
          precision: 3,
        },
        transform: ['svgo'],
      },
      mode: {
        stack: {
          dest: '../public/stack/',
          sprite: 'wjc.stack.svg',
        },
      },
    }),
  )
  .pipe(gulp.dest('./public/'));
