import express from 'express';
import launchMiddleware from 'launch-editor-middleware';

const createApp = () => {
  const app = express();
  // https://github.com/yyx990803/launch-editor#readme
  app.use('/__open-in-editor', launchMiddleware());

  return app;
};

export default function expressPlugin() {
  return {
    name: 'vite-launch-code-middleware-plugin',
    configureServer(server) {
      server.middlewares.use(createApp());
    },
  };
}
