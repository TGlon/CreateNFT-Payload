import { CollectionConfig } from 'payload/types';

export const NFTCollection: CollectionConfig = {
  slug: 'nft-items',
  labels: {
    singular: 'NFT Item',
    plural: 'NFT Items',
  },
  fields: [
    {
      name: 'nftItems',
      label: 'NFT Items',
      type: 'array',
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
        },
        {
          name: 'image',
          label: 'Image',
          type: 'upload',
          relationTo: 'media'
        },
        {
          name: 'attributes',
          label: 'Attributes',
          type: 'array',
          fields: [
            {
              name: 'trait_type',
              label: 'Trait Type',
              type: 'text',
            },
            {
              name: 'value',
              label: 'Value',
              type: 'text',
            },
          ]
        },
        {
          name: 'social_links',
          label: 'Social Links',
          type: 'text',
        },
        {
          name: 'quantity',
          label: 'Quantity',
          type: 'number',
          defaultValue: 1
        }
      ]
    },
    // {
    //   name: 'name',
    //   label: 'Name',
    //   type: 'text',
    // },
    // {
    //   name: 'description',
    //   label: 'Description',
    //   type: 'textarea',
    // },
    // {
    //   name: 'image',
    //   label: 'Image',
    //   type: 'upload',
    //   relationTo: 'media'
    // },
    // {
    //   name: 'attributes',
    //   label: 'Attributes',
    //   type: 'array',
    //   fields: [
    //     {
    //       name: 'trait_type',
    //       label: 'Trait Type',
    //       type: 'text',
    //     },
    //     {
    //       name: 'value',
    //       label: 'Value',
    //       type: 'text',
    //     },
    //   ]
    // },
    // {
    //   name: 'social_links',
    //   label: 'Social Links',
    //   type: 'text',
    // },
  ],

};
