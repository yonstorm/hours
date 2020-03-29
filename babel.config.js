module.exports = function babelConfig(api) {
  api.cache.forever();
  return {
    babelrcRoots: [
      // Keep the root as a root
      '.',
      // Also consider monorepo packages "root" and load their .babelrc files.
      './packages/*',
    ],
    presets: [
      [
        '@babel/env',
        {
          modules: false,
          targets: {
            browsers: ['> 2%'],
            node: '10'
          },
        },
      ],
    ],
    plugins: [
    ],
    env: {
      test: {
        presets: [
          [
            '@babel/env',
            {
              targets: {
                browsers: ['> 2%'],
                node: '10'
              },
            },
          ],
        ],
      },
    },
  };
};
