import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { readdir } from 'fs/promises';
import { openWallet } from '../utils';
import { NftCollection } from "../contracts/NftCollection";
import { NftItem } from "../contracts/NftItem";
import { GetGemsSaleData, NftSale } from "../contracts/NftSale";
import { updateMetadataFiles, uploadFolderToIPFS } from '../metadata';
import { waitSeqno } from '../delay'
import { toNano } from "ton-core";
import { NftMarketplace } from "../contracts/NftMarketplace";
dotenv.config();
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NFTItem } from 'src/models/nft_items';
import * as fs from 'fs';
import * as path from 'path';
import { Address } from '@ton/core';
import { Mnemonic } from 'src/models/mnemonic';
@Injectable()
export class NftService {
  constructor(@InjectModel(NFTItem.name) private nftModel: Model<NFTItem>, @InjectModel(Mnemonic.name) private mnemonicModel: Model<Mnemonic>) { }
  async getAllNftItems(): Promise<NFTItem[]> {
    const NFT = await this.nftModel.find().exec();
    const dirPath = path.join(__dirname, '../../src/data/metadata');
    // Ensure the directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    let fileIndex = 0;
    NFT.forEach(doc => {
      // console.log(`Document ID: ${doc._id}`);

      // Lặp qua từng object trong mảng nftItems của document hiện tại
      doc.nftItems.forEach((item, index) => {
        // console.log(item);
        const attribute = item.attributes.map(attr => ({ trait_type: attr.trait_type, value: attr.value }));
        if (item.social_links) {
          // If social_links is present, save to collection.json
          const dataToSave = {
            name: item.name,
            image: item.image,
            // attributes: attribute,
            social_links: item.social_links
          };
          const filePath = path.join(dirPath, 'collection.json');

          // Save the data as collection.json
          fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2), (err) => {
            if (err) {
              console.error('Failed to write file:', err);
            } else {
              console.log(`File saved: ${filePath}`);
            }
          });
        } else {
          // If social_links is not present, save as index.json
          for (let i = 0; i < item.quantity; i++) {
            const dataToSave = {
              name: item.name,
              image: item.image,
              attributes: attribute
            };
            const filePath = path.join(dirPath, `${fileIndex}.json`);

            // Save the data as index.json
            fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2), (err) => {
              if (err) {
                console.error('Failed to write file:', err);
              } else {
                console.log(`File saved: ${filePath}`);
              }
            });
            fileIndex++;
          }
        }
      });
    });
    return NFT;
  }

  async init(): Promise<void> {
    const mnemonicData = await this.mnemonicModel.findOne().exec();
    console.log(mnemonicData.mnemonic);

    if (!mnemonicData || !mnemonicData.mnemonic) {
      throw new Error('Mnemonic not found in the database');
    }
    const createNftItems = await this.getAllNftItems();
    if(createNftItems){
      console.log("Create NFTItems ");
      
    }
    const metadataFolderPath = './src/data/metadata/';
    const imagesFolderPath = './src/data/images';
    // const targetWalletAddress = Address.parse('0QB56RbbrikjhcKVegAfhExt9_RjOeDiyzaN2_IwtLEALhgm');
    const wallet = await openWallet(mnemonicData.mnemonic.split(' '), true);
    console.log('Started uploading images to IPFS...');
    const imagesIpfsHash = await uploadFolderToIPFS(imagesFolderPath);
    console.log(
      `Successfully uploaded the pictures to IPFS: https://gateway.pinata.cloud/ipfs/${imagesIpfsHash}`,
    );

    console.log('Started uploading metadata files to IPFS...');
    await updateMetadataFiles(metadataFolderPath, imagesIpfsHash);
    const metadataIpfsHash = await uploadFolderToIPFS(metadataFolderPath);
    console.log(
      `Successfully uploaded the metadata to IPFS: https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`,
    );

    console.log('Start deploy of NFT collection...');
    const collectionData = {
      ownerAddress: wallet.contract.address,
      royaltyPercent: 0.05, // 0.05 = 5%
      royaltyAddress: wallet.contract.address,
      nextItemIndex: 0,
      collectionContentUrl: `ipfs://${metadataIpfsHash}/collection.json`,
      commonContentUrl: `ipfs://${metadataIpfsHash}/`,
    };
    const collection = new NftCollection(collectionData);
    let seqno = await collection.deploy(wallet);
    console.log(`Collection deployed: ${collection.address}`);
    await waitSeqno(seqno, wallet);

    // Deploy NFT items
    const files = await readdir(metadataFolderPath);
    files.pop();
    let index = 0;

    seqno = await collection.topUpBalance(wallet, files.length);
    await waitSeqno(seqno, wallet);
    console.log(`Balance top-upped`);

    for (const file of files) {
      console.log(`Start deploy of ${index + 1} NFT`);
      const mintParams = {
        queryId: 0,
        itemOwnerAddress: wallet.contract.address,
        itemIndex: index,
        amount: toNano('0.05'),
        commonContentUrl: file,
      };
      const nftItem = new NftItem(collection);
      seqno = await nftItem.deploy(wallet, mintParams);
      console.log(`Successfully deployed ${index + 1} NFT`);
      await waitSeqno(seqno, wallet);
      index++;
    }

    // console.log('Start deploy of new marketplace');
    // const marketplace = new NftMarketplace(wallet.contract.address);
    // seqno = await marketplace.deploy(wallet);
    // await waitSeqno(seqno, wallet);
    // console.log('Successfully deployed new marketplace');

    // const nftToSaleAddress = await NftItem.getAddressByIndex(collection.address, 0);
    // const saleData: GetGemsSaleData = {
    //   isComplete: false,
    //   createdAt: Math.ceil(Date.now() / 1000),
    //   marketplaceAddress: marketplace.address,
    //   nftAddress: nftToSaleAddress,
    //   nftOwnerAddress: null,
    //   fullPrice: toNano('10'),
    //   marketplaceFeeAddress: wallet.contract.address,
    //   marketplaceFee: toNano('1'),
    //   royaltyAddress: wallet.contract.address,
    //   royaltyAmount: toNano('0.5'),
    // };
    // const nftSaleContract = new NftSale(saleData);
    // seqno = await nftSaleContract.deploy(wallet);
    // await waitSeqno(seqno, wallet);

    // await NftItem.transfer(wallet, nftToSaleAddress, nftSaleContract.address);
    // Sau khi hoàn thành việc triển khai các NFT, bắt đầu việc xóa file JSON trong thư mục metadata1
    const metadata1FolderPath = './src/data/metadata/';
    console.log('Bắt đầu xóa các file JSON trong thư mục metadata...');

    const files1 = await fs.promises.readdir(metadata1FolderPath);
    for (const file of files1) {
      const filePath = path.join(metadata1FolderPath, file);
      if (path.extname(filePath) === '.json') {
        await fs.promises.unlink(filePath);
        console.log(`Đã xóa file: ${filePath}`);
      }
    }
    console.log('Đã xóa tất cả các file JSON trong thư mục metadata');
  }
}