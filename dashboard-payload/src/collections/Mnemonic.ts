import { CollectionConfig } from 'payload/types';

export const Mnemonic: CollectionConfig = {
  slug: 'Mnemonic',
  labels: {
    singular: 'Mnemonic',
    plural: 'Mnemonic',
  },
  fields: [
    {
      name: 'mnemonic',
      label: '24 Phrase',
      type: 'text',
    },
  ],
};
