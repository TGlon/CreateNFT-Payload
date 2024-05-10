// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// // Subdocument for Attributes in the NFT item
// class Attribute {
//     @Prop({ required: true })
//     trait_type: string;

//     @Prop({ required: true })
//     value: string;
// }

// @Schema({ collection: 'nft-items' })
// export class NFTItem extends Document {
//     @Prop({ required: true })
//     name: string;

//     @Prop({ required: true })
//     description: string;

//     @Prop()
//     image: string;

//     @Prop({ type: [Attribute], default: [] })
//     attributes: Attribute[];
//     @Prop({ type: [String], default: [] })
//     social_links: string[];
//     @Prop()
//     quantity: string;
// }

// export const NFTItemSchema = SchemaFactory.createForClass(NFTItem);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Number, SchemaTypes } from 'mongoose';

// Subdocument for Attributes in the NFT item
class Attribute {
    @Prop({ required: true })
    trait_type: string;

    @Prop({ required: true })
    value: string;
}

// Subdocument for NFT Item in the nftItems array
class NFTItemElement {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Media' })
    image: string;

    @Prop({ type: [Attribute], default: [] })
    attributes: Attribute[];

    @Prop()
    social_links: string;

    @Prop({ required: true })
    quantity: number; // Có thể cần cập nhật kiểu dữ liệu
}

@Schema({ collection: 'nft-items' })
export class NFTItem extends Document {
    @Prop({ type: [NFTItemElement], default: [] })
    nftItems: NFTItemElement[]; // Mảng chứa các NFT Item

    // Các trường khác vẫn giữ nguyên như trước đây
}

export const NFTItemSchema = SchemaFactory.createForClass(NFTItem);
