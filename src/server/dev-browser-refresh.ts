import { watch } from 'chokidar';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { EventEmitter } from 'events';

const __dirname = dirname(fileURLToPath(import.meta.url))

const DIST_DIR_PATH = resolve(__dirname, '../../dist')

const log = console.log.bind(console);

const reload = (socketio: EventEmitter) =>  {
    socketio.emit('reload')
}

export const reloadBrowser = (socketio: EventEmitter) => {
    const watcher = watch(DIST_DIR_PATH, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
    });

    watcher
        .on('add', () => reload(socketio))
        .on('change', () => reload(socketio))
        .on('unlink', () => reload(socketio));

    log('Reload browser when files change in ', DIST_DIR_PATH);
    return watcher;
}

// More possible events.
// watcher
//     .on('addDir', path => log(`Directory ${path} has been added`))
//     .on('unlinkDir', path => log(`Directory ${path} has been removed`))
//     .on('error', error => log(`Watcher error: ${error}`))
//     .on('ready', () => log('Initial scan complete. Ready for changes'))
//     .on('raw', (event, path, details) => { // internal
//         log('Raw event info:', event, path, details);
//     });

// 'add', 'addDir' and 'change' events also receive stat() results as second
// argument when available: https://nodejs.org/api/fs.html#fs_class_fs_stats
// watcher.on('change', (path, stats) => {
//     if (stats) console.log(`File ${path} changed size to ${stats.size}`);
// });

// Watch new files.
// watcher.add('new-file');
// watcher.add(['new-file-2', 'new-file-3', '**/other-file*']);

// Get list of actual paths being watched on the filesystem
// var watchedPaths = watcher.getWatched();

// Un-watch some files.
// await watcher.unwatch('new-file*');

// Stop watching.
// The method is async!
// watcher.close().then(() => console.log('closed'));

// Full list of options. See below for descriptions.
// Do not use this example!
// chokidar.watch('file', {
//     persistent: true,
//
//     ignored: '*.txt',
//     ignoreInitial: false,
//     followSymlinks: true,
//     cwd: '.',
//     disableGlobbing: false,
//
//     usePolling: false,
//     interval: 100,
//     binaryInterval: 300,
//     alwaysStat: false,
//     depth: 99,
//     awaitWriteFinish: {
//         stabilityThreshold: 2000,
//         pollInterval: 100
//     },
//
//     ignorePermissionErrors: false,
//     atomic: true // or a custom 'atomicity delay', in milliseconds (default 100)
// });