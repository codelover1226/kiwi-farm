import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './sanity/schemas';

const config = defineConfig({
  projectId: '5srusl5s',
  dataset: 'production',
  title: 'MM7_final',
  apiVersion: '2023-10-25',
  basePath: '/admin',
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
});

export default config;
