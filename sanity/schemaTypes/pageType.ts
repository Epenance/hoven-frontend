import { defineField, defineType } from 'sanity'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Page title',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Page slug (URL)',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'spots',
      title: 'Spots',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'contentSpotsHero',
          title: 'Hero',
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
            prepare({ title, media }) {
              return {
                title: "Hero: " + title,
                media: media,
              }
            }
          },
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'Hero title'
            },
            {
              name: 'text',
              title: 'Text',
              type: 'text',
              description: 'Hero text'
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
            },
          ]
        },
        {
          type: 'object',
          name: 'contentSpotsCta',
          title: 'CTA',
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
            prepare({ title, media }) {
              return {
                title: "CTA: " + title,
                media: media,
              }
            }
          },
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'CTA title'
            },
            {
              name: 'text',
              title: 'Text',
              type: 'text',
              description: 'CTA text'
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
            },
          ]
        },
      ],
    })
  ]
})