import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { readFileSync } from 'fs';

// Read package.json as a workaround for ES modules JSON import assertion
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react/jsx-runtime': 'jsxRuntime'
      }
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react/jsx-runtime': 'jsxRuntime'
      }
    },
    {
      file: 'dist/index.browser.js',
      format: 'umd',
      name: 'BananaCrystalPayment',
      sourcemap: true,
      exports: 'named',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react/jsx-runtime': 'jsxRuntime'
      },
      // This is important for UMD bundles to work correctly
      intro: 'var global = typeof window !== "undefined" ? window : this;'
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx'],
    }),
    postcss({
      extensions: ['.css'],
      minimize: true,
      inject: {
        insertAt: 'top',
      },
    }),
  ],
  external: [
    'react', 
    'react-dom',
    'react/jsx-runtime',
    'fs',
    'path',
    'url',
    'util',
    'stream',
    'http',
    'https',
    'zlib',
    'crypto',
    'buffer',
    'os',
    'assert',
    'events',
    'querystring',
    'string_decoder',
    'punycode',
    'process',
    'child_process',
    'tty',
    'net',
    'dns',
    'dgram',
    'readline',
    'repl',
    'vm',
    'module',
    'constants',
    'timers',
    'console',
    'perf_hooks',
    'async_hooks',
    'worker_threads',
    'cluster',
    'v8',
    'inspector',
    'trace_events',
    'tls',
    'domain',
    'sys',
    'http2',
    'diagnostics_channel',
    'wasi',
    'inspector',
    'inspector_sync',
    'inspector_async',
    'inspector_protocol',
    'inspector_session',
    'inspector_console',
    'inspector_debugger',
    'inspector_profiler',
    'inspector_runtime',
    'inspector_schema',
    'inspector_heapprofiler',
    'inspector_network',
    'inspector_page',
    'inspector_css',
    'inspector_dom',
    'inspector_overlay',
    'inspector_security',
    'inspector_audits',
    'inspector_io',
    'inspector_memory',
    'inspector_accessibility',
    'inspector_animation',
    'inspector_application_cache',
    'inspector_browser',
    'inspector_cache_storage',
    'inspector_database',
    'inspector_device_orientation',
    'inspector_dom_debugger',
    'inspector_dom_snapshot',
    'inspector_dom_storage',
    'inspector_emulation',
    'inspector_fetch',
    'inspector_indexed_db',
    'inspector_input',
    'inspector_inspector',
    'inspector_layer_tree',
    'inspector_log',
    'inspector_media',
    'inspector_network_storage',
    'inspector_performance',
    'inspector_service_worker',
    'inspector_storage',
    'inspector_system_info',
    'inspector_target',
    'inspector_tethering',
    'inspector_tracing',
    'inspector_web_audio',
    'inspector_web_authn',
    'inspector_worker',
  ],
};
