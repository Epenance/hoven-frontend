import type { Schema, Struct } from '@strapi/strapi';

export interface MiscLink extends Struct.ComponentSchema {
  collectionName: 'components_misc_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    Page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    Text: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

export interface SpotsHero extends Struct.ComponentSchema {
  collectionName: 'components_spots_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    Link: Schema.Attribute.Component<'misc.link', false>;
    Text: Schema.Attribute.Blocks;
    Title: Schema.Attribute.String;
  };
}

export interface SpotsTextAndImage extends Struct.ComponentSchema {
  collectionName: 'components_spots_text_and_images';
  info: {
    displayName: 'Text And Image';
  };
  attributes: {
    Media: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    Reversed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Text: Schema.Attribute.Blocks;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'misc.link': MiscLink;
      'spots.hero': SpotsHero;
      'spots.text-and-image': SpotsTextAndImage;
    }
  }
}
