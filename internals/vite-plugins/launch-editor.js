import express from 'express';
import launchMiddleware from 'launch-editor-middleware';

const createApp = () => {
  const app = express();
  // https://github.com/yyx990803/launch-editor#readme
  app.use('/__open-in-editor', launchMiddleware());

  return app;
};

export default function LaunchEditorPlugin() {
  return {
    name: 'launch-editor-plugin',
    configureServer(server) {
      server.middlewares.use(createApp());
    },
  };
}
