/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-19 03:44:38
 * @Last modified by:   Matteo
 * @Last modified time: 2017-08-19 07:08:52
 */

module.exports = {
  'type': 'object',
  'properties': {
    'method': {
      'type': 'string',
      'enum': [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'HEAD',
        'DELETE'
      ],
      'default': 'GET'
    },
    'path': {
      'type': 'string',
      'format': 'abs-path',
      'default': '/'
    },
    'name': {
      'type': 'string'
    }
  },
  'additionalProperties': false,
  'required': [
    'method',
    'path',
    'name'
  ]
}
