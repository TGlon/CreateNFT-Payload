  import React from "react";
  import { Gutter, Eyebrow, Button } from "payload/components/elements";
  import axios from "axios";
  export default function Dashboard() {
  //   // const saveImages = async (imageUrl, imageName) => {
  //   //   try {
  //   //     const currentTime = new Date().getTime();
  //   //     const filename = `${imageName}_${currentTime}.jpg`;
  //   //     const response = await axios.post(
  //   //       "http://localhost:3000/api/save-images",
  //   //       {
  //   //         images: [{ url: imageUrl, filename: filename }],
  //   //       }
  //   //     );

  //   //     console.log("Images saved:", response.data.images[0].id);
  //   //     // Trả về tên của file đã được tạo ra
  //   //     return response.data.images[0].id;
  //   //   } catch (error) {
  //   //     console.error("Error saving images:", error);
  //   //     return null; // Bạn có thể trả về null hoặc một giá trị khác trong trường hợp có lỗi
  //   //   }
  //   // };
  //   const saveImages = async (imageUrl, imageName) => {
  //     try {
  //         const currentTime = new Date().getTime();
  //         // Thay thế khoảng trắng bằng dấu gạch dưới trong tên ảnh
  //         const sanitizedImageName = imageName.replace(/\s+/g, '_');
  //         const filename = `${sanitizedImageName}_${currentTime}.jpg`;

  //         const response = await axios.post(
  //             "http://localhost:3000/api/save-images",
  //             {
  //                 images: [{ url: imageUrl, filename: filename }],
  //             }
  //         );

  //         console.log("Images saved:", response.data.images[0].id);
  //         // Trả về tên của file đã được tạo ra
  //         return response.data.images[0].id;
  //     } catch (error) {
  //         console.error("Error saving images:", error);
  //         return null; // Bạn có thể trả về null hoặc một giá trị khác trong trường hợp có lỗi
  //     }
  // };

  //   const handleClick = async () => {
  //     // Replace account_id with the actual account ID you want to fetch data for
  //     const account_id = "kQCyYKNvKTxKuLIXevSOxshtE2fTAQzaZ1PSPUIq7-EEAsM8";

  //     try {
  //       // Fetch data from the TON API
  //       const response = await fetch(
  //         `https://testnet.tonapi.io/v2/nfts/collections/${account_id}/items`
  //       );

  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }

  //       // Parse the response JSON
  //       const data = await response.json();
  //       // console.log(data.nft_items);
  //       // for (const item of data.nft_items){
  //       //   console.log(item.metadata.image);
  //       // }
  //       for (const item of data.nft_items) {
  //         // console.log(item.previews[2].url);
  //         const filename = await saveImages(item.previews[2].url, item.metadata.name);
  //         // console.log(filename);
  //         /////////////////////////////////////////////////////////////
  //         const formData = new FormData();
  //         formData.append("name", item.metadata.name);
  //         formData.append("balance", item.metadata.attributes[0].value);
  //         formData.append("owner", item.owner.address);
  //         formData.append("description", item.metadata.description);
  //         formData.append("image", filename);
  //         const payloadResponse = await fetch("http://localhost:3000/api/forms", {
  //           method: "POST",
  //           headers: {
  //             // Authorization:
  //             //   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzM2MjI4MGQ5OTk3OTUyNWIyNDVlYyIsImNvbGxlY3Rpb24iOiJ1c2VycyIsImVtYWlsIjoicGF5bG9hZEBnbWFpbC5jb20iLCJpYXQiOjE3MTQ3ODU1MTEsImV4cCI6MTcxNDc5MjcxMX0.b06gTYh1RtAhKnKjCn5pU4fX-X_RhJFOuUSRd7dgqPQ", // Replace with actual token if required
  //           },
  //           body: formData,
  //         });

  //         if (!payloadResponse.ok) {
  //           throw new Error("Failed to save to Payload CMS");
  //         }

  //         console.log(
  //           "Data saved successfully to Payload CMS:",
  //           await payloadResponse.json()
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error occurred:", error);
  //     }
  //   };
  const handleClick = async () => {
    try {
      const API = process.env.PAYLOAD_PUBLIC_API_NFT;
        // Make a GET request to localhost:5000/nft/init
        const response = await fetch(API);
        
        // Check if the response is successful
        if (response.ok) {
            // const data = await response.json();
            // Handle the response data
            console.log('OK');
            window.alert('Created successfully');
            // You can perform further actions with the data as needed
        } else {
            console.error('Request failed with status:', response.status);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
  };
    return (
      <>
        {/* <Eyebrow></Eyebrow> */}
        <Gutter>
          <h1>CREATE NFT WITH PAYLOAD</h1>
          <div>
            <Button onClick={handleClick}>Create NFT</Button>
          </div>
        </Gutter>
      </>
    );
  }
