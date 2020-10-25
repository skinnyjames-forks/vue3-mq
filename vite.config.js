const path = require('path');

module.exports = {
    rollupInputOptions: {
        input: 'src/index.js'
    },
    rollupOutputOptions: {
        //dir: 'dist/vue3-mq.js'
    },
    outDir: path.resolve(process.cwd(), 'dist'),
    assetsDir: '',
    emitIndex: false,
}