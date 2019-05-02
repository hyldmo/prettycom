// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
let script = document.createElement('script');
const port = process.env.PORT || 1337;

const appendScript = (name) => {
    const script = document.createElement('script');
    script.src = process.env.NODE_ENV == 'development'
        ? 'http://localhost:' + port + '/'+name+'.js?mode=' + process.env.NODE_ENV
        : './dist/'+name+'.js';
    // TODO: Writing the script path should be done with webpack
    document.body.appendChild(script);
}

appendScript('vendor')
appendScript('main')
