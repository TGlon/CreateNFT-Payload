import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { NftService } from './nft.service';
// import { NftCollection } from '../contracts/NftCollection';
import { NFTItem } from 'src/models/nft_items';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get('init')
  async initNFTs(): Promise<void> {
    await this.nftService.init();
    // return 'NFT system initialized successfully';
  }
  @Get()
  async getAllNftItems(): Promise<NFTItem[]> {
    return this.nftService.getAllNftItems();
  }
}
