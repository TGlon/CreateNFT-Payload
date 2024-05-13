import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { NftService } from './nft/nft.service';
import { NftController } from './nft/nft.controller';
import { NftService } from './nft/nft.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NFTItem, NFTItemSchema } from './models/nft_items';
import { Media, MediaSchema } from './models/media';
import { Mnemonic, MnemonicSchema } from './models/mnemonic';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
        dbName: "nft"
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: NFTItem.name, schema: NFTItemSchema }, { name: Media.name, schema: MediaSchema },  { name: Mnemonic.name, schema: MnemonicSchema }]),
  ],
  controllers: [AppController, NftController],
  providers: [AppService, NftService],
})
export class AppModule {}
