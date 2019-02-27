const glob = require('glob');
const path = require('path');

const files = glob.sync(path.join(__dirname, 'renderers/**/*.js'));
const filesArr = {};

files.forEach(file => {
    const fileNameJS = file.split('/').pop();
    const fileName = fileNameJS.substr(0, fileNameJS.length - 3);
    filesArr[fileName] = require(file); // eslint-disable-line global-require, import/no-dynamic-require, max-len
});

window.files = filesArr;
