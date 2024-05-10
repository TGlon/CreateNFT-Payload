import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload/config'

import Users from './collections/Users'
import { Form } from './collections/Forms'
import { Media } from './collections/Medias'
import Dashboard from './views/Dashboard'
import { NFTCollection } from './collections/NftCollections'
import { Mnemonic } from './collections/Mnemonic'

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    components:{
      views: {
        Dashboard: Dashboard
      }
    }
  },
  editor: slateEditor({}),
  collections: [Users, Media, NFTCollection, Mnemonic],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
