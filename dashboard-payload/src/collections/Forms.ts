import { CollectionConfig } from 'payload/types';

export const Form: CollectionConfig = {
  slug: 'forms',
  labels: {
    singular: 'Form',
    plural: 'Forms',
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      name: 'balance',
      label: 'Balance',
      type: 'text',
    },
    {
      name: 'owner',
      label: 'Owner',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media'
    },
  ],
  
};
