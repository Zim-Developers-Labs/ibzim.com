import { visionTool } from '@sanity/vision';
import { deskTool } from 'sanity/desk';
import { media } from 'sanity-plugin-media';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './src/sanity/lib/api';
import { schemaTypes } from './src/sanity/schemas';
import { structure } from './src/sanity/desk-structure';
import { customDocumentActions } from './src/sanity/plugins/customDocumentActions';
import { vercelDeployTool } from 'sanity-plugin-vercel-deploy';
import { defineConfig } from 'sanity';

export default defineConfig([
  {
    name: 'IB-Studio',
    basePath: '/studio',
    title: 'IB Studio',
    projectId: projectId,
    dataset,

    schema: {
      types: schemaTypes,
    },

    plugins: [
      deskTool({ structure }),
      media(),
      visionTool({ defaultApiVersion: apiVersion }),
      vercelDeployTool(),
      customDocumentActions(),
    ],
  },
]);
