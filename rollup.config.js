import resolve from 'rollup-plugin-local-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import copy from 'rollup-plugin-copy';

const globals = {
  'apollo-cache': 'apolloCache.core',
  'apollo-client': 'apollo.core',
  'apollo-link': 'apolloLink.core',
  'apollo-utilities': 'apollo.utilities',
};

export default {
  input: 'lib/index.js',
  output: {
    file: 'lib/bundle.umd.js',
    format: 'umd',
    exports: 'named',
    name: 'apollo-link-directive',
    globals,
    sourcemap: true,
  },
  external: Object.keys(globals),
  onwarn,
  plugins: [
    resolve(),
    sourcemaps(),
    copy({
      targets: [
        { src: 'README.md', dest: 'lib' },
        { src: 'LICENSE', dest: 'lib' },
      ],
    }),
  ],
};

function onwarn(message) {
  const suppressed = ['UNRESOLVED_IMPORT', 'THIS_IS_UNDEFINED'];

  if (!suppressed.find(code => message.code === code)) {
    return console.warn(message.message);
  }
}
