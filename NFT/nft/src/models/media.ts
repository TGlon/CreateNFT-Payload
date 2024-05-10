import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'media' })
export class Media extends Document {
  @Prop({ required: true })
  alt: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  filesize: number;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;

  @Prop({ type: Object })
  sizes: {
    thumbnail: {
      width: number;
      height: number;
      mimeType: string;
      filesize: number;
      filename: string;
    };
    card: {
      width: number | null;
      height: number | null;
      mimeType: string | null;
      filesize: number | null;
      filename: string | null;
    };
    tablet: {
      width: number;
      height: number;
      mimeType: string;
      filesize: number;
      filename: string;
    };
  };
}

// Create the Media schema using the SchemaFactory helper
export const MediaSchema = SchemaFactory.createForClass(Media);
