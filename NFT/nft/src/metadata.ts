// import pinataSDK from "@pinata/sdk";
import { readdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
// import path from "path";
const fs = require('fs');
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
export async function uploadFolderToIPFS(folderPath: string): Promise<string> {
  const pinataSDK = require("@pinata/sdk");

  const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_API_SECRET,
  });

  const response = await pinata.pinFromFS(folderPath);
  return response.IpfsHash;
}

// export async function updateMetadataFiles(
//   metadataFolderPath: string,
//   imagesIpfsHash: string
// ): Promise<void> {
//   const path = require('path')
//   const files = readdirSync(metadataFolderPath);

//   files.forEach(async (filename, index) => {
//     const filePath = path.join(metadataFolderPath, filename);
//     const file = await readFile(filePath);

//     const metadata = JSON.parse(file.toString());
//     metadata.image =
//       index != files.length - 1
//         ? `ipfs://${imagesIpfsHash}/${index}.jpg`
//         : `ipfs://${imagesIpfsHash}/logo.jpg`;

//     await writeFile(filePath, JSON.stringify(metadata));
//   });
// }
//////////////////////////////////////////////////////////////////////////////
// export async function updateMetadataFiles(
//   metadataFolderPath: string,
//   imagesIpfsHash: string
// ): Promise<void> {
//   const files = await readdir(metadataFolderPath);
//   const contentMap = new Map();
//   let imageIndex = 0;

//   // First pass: map file contents to an image index
//   for (const filename of files) {
//     const filePath = path.join(metadataFolderPath, filename);
//     const fileContent = await readFile(filePath, 'utf8');
    
//     // Use a consistent identifier for content, e.g., hash or direct content comparison
//     if (!contentMap.has(fileContent)) {
//       contentMap.set(fileContent, imageIndex++);
//     }
//   }

//   // Second pass: update the metadata with the image index
//   for (const filename of files) {
//     const filePath = path.join(metadataFolderPath, filename);
//     const fileContent = await readFile(filePath, 'utf8');

//     const metadata = JSON.parse(fileContent);
//     const index = contentMap.get(fileContent);

//     metadata.image =
//           index != files.length - 1
//             ? `ipfs://${imagesIpfsHash}/${index}.jpg`
//             : `ipfs://${imagesIpfsHash}/logo.jpg`;
    
//     await writeFile(filePath, JSON.stringify(metadata, null, 2));  // Beautify JSON output
//   }
// }
/////////////////////////////////////////////////////////////////////////////////
export async function updateMetadataFiles(
    metadataFolderPath: string,
    imagesIpfsHash: string
  ): Promise<void>  {
  const files = await readdir(metadataFolderPath);
  const contentMap = new Map();
  let imageIndex = 0;

  // First pass: map file contents to an image index
  for (const filename of files) {
    const filePath = path.join(metadataFolderPath, filename);
    const fileContent = await readFile(filePath, 'utf8');
    
    // Skip adding index for 'collection.json' here
    if (filename !== 'collection.json' && !contentMap.has(fileContent)) {
      contentMap.set(fileContent, imageIndex++);
    }
  }

  // Second pass: update the metadata with the image index
  for (const filename of files) {
    const filePath = path.join(metadataFolderPath, filename);
    const fileContent = await readFile(filePath, 'utf8');

    const metadata = JSON.parse(fileContent);

    // Apply special case for 'collection.json'
    if (filename === 'collection.json') {
      metadata.image = `ipfs://${imagesIpfsHash}/logo.jpg`;
    } else {
      const index = contentMap.get(fileContent);
      metadata.image = `ipfs://${imagesIpfsHash}/${index}.jpg`;
    }
    
    await writeFile(filePath, JSON.stringify(metadata, null, 2));  // Beautify JSON output
  }
}
