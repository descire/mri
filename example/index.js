const parse = require('../src/index');

// 默认控制台是以空格
console.log(process.argv.slice(2))


parse(process.argv.slice(2), {
  // boolean: ['h', 'help'],
  alias: {
    help: 'h'
  },
  default: {
    save: true
  }
})
