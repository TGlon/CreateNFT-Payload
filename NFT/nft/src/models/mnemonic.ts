import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'mnemonics' })
export class Mnemonic extends Document {
  @Prop({ required: true })
  mnemonic: string;
 
}

export const MnemonicSchema = SchemaFactory.createForClass(Mnemonic);
