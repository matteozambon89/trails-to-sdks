/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-16 03:00:37
 * @Last modified by:   Matteo
 * @Last modified time: 2017-10-14 11:59:14
 */

module.exports = {
  'prj': {
    'id': 'javascript-node',
    'name': 'Javascript Node',
    'language': 'javascript',
    'framework': 'node'
  },
  'templates': {
    'packageJson': {
      'src': './template/package-json.mustache',
      'fileName': 'package.json',
      'dest': './'
    },
    'baseModel': {
      'src': './template/base-model.mustache',
      'fileName': 'base-model.js',
      'dest': './'
    },
    'client': {
      'src': './template/client.mustache',
      'fileName': 'client.js',
      'dest': './'
    },
    'schema': {
      'src': './template/schema.mustache',
      'fileName': '{modelPrefix}-{modelName}.js',
      'dest': './schema'
    },
    'model': {
      'src': './template/model.mustache',
      'fileName': '{modelPrefix}-{modelName}.js',
      'dest': './models'
    }
  }
}
