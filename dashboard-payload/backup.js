import React from "react";
import { Gutter, Eyebrow, Button } from "payload/components/elements";
import axios from "axios";
export default function Dashboard() {
  const saveImages = async (imageUrl, imageName) => {
    try {
      const currentTime = new Date().getTime();
      const filename = `${imageName}_${currentTime}.jpg`;
      const response = await axios.post(
        "http://localhost:3000/api/save-images",
        {
          images: [{ url: imageUrl, filename: filename }],
        }
      );

      console.log("Images saved:", response.data.images[0].id);
      // Trả về tên của file đã được tạo ra
      return response.data.images[0].id;
    } catch (error) {
      console.error("Error saving images:", error);
      return null; // Bạn có thể trả về null hoặc một giá trị khác trong trường hợp có lỗi
    }
  };
  const handleClick = async () => {
    // Replace account_id with the actual account ID you want to fetch data for
    const account_id = "0QB56RbbrikjhcKVegAfhExt9_RjOeDiyzaN2_IwtLEALhgm";

    try {
      // Fetch data from the TON API
      const response = await fetch(
        `https://testnet.tonapi.io/v2/accounts/${account_id}/jettons?currencies=ton`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse the response JSON
      const data = await response.json();
      for (const item of data.balances) {
        // console.log(item.jetton.image);
        const filename = await saveImages(item.jetton.image, item.jetton.name);
        console.log(filename);
        /////////////////////////////////////////////////////////////
        const formData = new FormData();
        formData.append("name", item.jetton.name);
        formData.append("balance", item.balance);
        formData.append("owner", item.wallet_address.address);
        formData.append("description", item.jetton.verification);
        formData.append("image", filename);
        const payloadResponse = await fetch("http://localhost:3000/api/forms", {
          method: "POST",
          headers: {
            // Authorization:
            //   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzM2MjI4MGQ5OTk3OTUyNWIyNDVlYyIsImNvbGxlY3Rpb24iOiJ1c2VycyIsImVtYWlsIjoicGF5bG9hZEBnbWFpbC5jb20iLCJpYXQiOjE3MTQ3ODU1MTEsImV4cCI6MTcxNDc5MjcxMX0.b06gTYh1RtAhKnKjCn5pU4fX-X_RhJFOuUSRd7dgqPQ", // Replace with actual token if required
          },
          body: formData,
        });

        if (!payloadResponse.ok) {
          throw new Error("Failed to save to Payload CMS");
        }

        console.log(
          "Data saved successfully to Payload CMS:",
          await payloadResponse.json()
        );
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <>
      {/* <Eyebrow></Eyebrow> */}
      <Gutter>
        <h1>Dashboard</h1>
        <div>
          <Button onClick={handleClick}>Click Me</Button>
        </div>
      </Gutter>
    </>
  );
}
