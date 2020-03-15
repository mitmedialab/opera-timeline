import { populateHtmlFields } from './populate-html-fields.mjs';
import yaml from '@rollup/plugin-yaml';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import nodePolyfills from 'rollup-plugin-node-polyfills';

// `mainFields` determines weather we import modules via es6 `pkg.module` field,
// or via its 'main' field. d3-media-timeline has both 'module' and 'main'
// fields. Whichever appears first in the array below will be used.
const resolvePlugin  = resolve({
  mainFields: ['main:jsnext', 'jsnext', 'module', 'main'],
  preferBuiltins: false,
});

// The timeline needs node's 'events' module. If importing d3-media-timeline via
// es6 modules, we need to be able to resolve the 'events'. If importing the
// bundled code, the polyfill will already be included, and the rollup polyfill
// plugin will have no effect.
const polyfillPlugin = nodePolyfills();

const commonjsPlugin = commonjs({
  namedExports: {
    // If we are importing d3-media-timeline from via its es6 'pkg.module'
    // field, then we do not need to specify its 'namedExports'. However, if we
    // are importing its bundled code via its 'pkg.main' field, then we need to
    // tell rollup via the line below, what fields are exported.
    // Note that the
    'd3-media-timeline': ['d3', 'createTimelineEvents', 'Timeline', 'MasterTimeline', 'TimelineEvent']
  }
});

const yamlPlugin = yaml({ transform: populateHtmlFields });

const babelPlugin = babel({
  include: ['**/d3-media-timeline/**', 'src/**'],
  plugins: [
    ["@babel/plugin-transform-classes", {}],
  ],
  presets: [
    ["@babel/preset-env", { "targets": "> 2.00%, not dead"} ]
  ],
  babelrc: false
});

const baseConfig = {
  input: 'src/main.mjs',
  output: {
    file: 'html/main.js',
    format: 'iife', // iife = browser, umd = browser/node
    name: 'MT',
  },
  // By default, do not babel things.
  // Note that Babel has difficulty crossing package boundaries.
  // It is easy to use babel rollup plugin on code in THIS repo
  // It is NOT practical to use babel rollup plugin on code in node_modules/
  plugins: [ yamlPlugin, polyfillPlugin, resolvePlugin, commonjsPlugin ],
};

// When exporting a function, command line args are passed into that function.
// For example if we run rollup with:
//
// $ rollup --config rollup.config.js --configProd
//
// ...then commandLineArgs.configProd will be truthy in the function below.
export default commandLineArgs => {
  if (commandLineArgs.configProd) {
    console.log('building in production mode');
    baseConfig.plugins = [ babelPlugin, polyfillPlugin, yamlPlugin, resolvePlugin, commonjsPlugin ];
  } else {
    console.log('building in development mode');
  }

  return baseConfig;
}
