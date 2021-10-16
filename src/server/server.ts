require('svelte/register')({
    // extensions: ['.svelte'],
    // css: false,
    hydratable: true,
    // dev: process.env.NODE_ENV !== 'production'
})
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import { renderSSR } from './render';

const __dirname = dirname(fileURLToPath(import.meta.url));

const Shapes = require('../pages/Home.svelte').default;

const STATIC_DIR_PATH = join(__dirname, '../../dist');
console.log('The static dir path: ', STATIC_DIR_PATH);

const isDev = process.env.NODE_ENV === 'development';

const buildServer = async () => {
    const server = await fastify();

    await server.register(fastifyStatic, {
        root: STATIC_DIR_PATH,
        prefix: '/dist/'
    });

    return server;
};

const main = async () => {
    const server = await buildServer();

    server.get('/ssr', async (request, reply) => {
        reply.header('Content-Type', 'text/html');
        const { head, html: body, css } = Shapes.render({
            title: 'Shapes'
        });

        reply.send(renderSSR({
            devMode: isDev,
            head,
            body,
            css,
            jsPath: '/pages/home.js'
        }));
    });


    server.listen(3006, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
};

main();


