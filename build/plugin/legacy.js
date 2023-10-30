import legacy from '@vitejs/plugin-legacy';

/**
 * 基于 @vitejs/plugin-legacy 配置浏览器兼容
 * @returns *
 */
export function configLegacyPlugin(viteEnv, isBuild) {

  const legacyPlugin = legacy({
    targets: ['defaults', 'ie >= 11', 'Android >= 7', 'chrome < 60', 'edge < 15'], // 需要兼容的目标列表，可以设置多个
    additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    renderLegacyChunks: true,
    polyfills: [
      'es.symbol',
      'es.array.filter',
      'es.promise',
      'es.promise.finally',
      'es/map',
      'es/set',
      'es.array.for-each',
      'es.object.define-properties',
      'es.object.define-property',
      'es.object.get-own-property-descriptor',
      'es.object.get-own-property-descriptors',
      'es.object.keys',
      'es.object.to-string',
      'web.dom-collections.for-each',
      'esnext.global-this',
      'esnext.string.match-all'
    ]
  })
  return legacyPlugin
}
