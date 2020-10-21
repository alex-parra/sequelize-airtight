module.exports = {
  spec: 'test/**/*.spec.js',
  asyncOnly: true,
  checkLeaks: true,
  diff: true,
  inlineDiffs: false,
  colors: true,
  bail: true,
  exit: true,
  require: ['test/support/hooks.js'],
};
