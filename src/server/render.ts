const DIST_DIRECTORY_PATH = '/dist';

export type SvelteCss = {
    code: string;
    map: string;
}

export type RenderSsrConfig = {
    body: string;
    head: string;
    devMode: boolean;
} & RenderClientConfig;

export type RenderClientConfig = {
    jsPath: string
    css: SvelteCss;
}

// Script used to reload browser page in development mode when changes are made to source files.
const liveReloadScript = `<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +':35729/livereload.js?snipver=1"></' + 'script>')</script>`;

export const renderSSR = (config: RenderSsrConfig) => `
<!DOCTYPE html>
<html lang="en">
<head>
${config.head}
${config.jsPath ? `<script defer src='${DIST_DIRECTORY_PATH}${config.jsPath}'></script>` : ''}
</head>
<body>
${config.body}
${config.devMode ? `${liveReloadScript}` : ''} 
</body>
</html>`;