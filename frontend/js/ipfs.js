// ipfs.js (Frontend)

export async function initializeIPFS() {
  try {
    const response = await fetch("http://localhost:5000/ping");
    if (!response.ok) {
      throw new Error(`Backend server error: ${response.status}`);
    }
    const data = await response.json();
    if (data.status !== "ok") {
      throw new Error("Backend server not ready");
    }
    console.log("Connected to IPFS backend");
    return true;
  } catch (error) {
    console.error("IPFS initialization error:", error);
    throw new Error("Failed to connect to IPFS backend. Please make sure the server is running.");
  }
}

export async function uploadToIPFS(file, title, description) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Upload failed");
    }

    const result = await response.json();
    
    if (!result.IpfsHash) {
      throw new Error("IPFS hash not received");
    }

    console.log("Upload successful. IPFS Hash:", result.IpfsHash);
    return result.IpfsHash;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

export async function fetchFromIPFS(ipfsHash) {
  try {
    const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("IPFS fetch error:", error);
    throw new Error(`Failed to fetch from IPFS: ${error.message}`);
  }
}
















// // ipfs.js (Frontend)

// export async function initializeIPFS() {
//   try {
//     const response = await fetch("http://localhost:5000/ping");
//     if (!response.ok) throw new Error("Backend IPFS server not responding.");
//     console.log("✅ Connected to local IPFS upload server.");
//   } catch (error) {
//     console.error("❌ IPFS init error:", error.message);
//     throw error;
//   }
// }

// export async function uploadToIPFS(file, title, description) {
//   try {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", title);
//     formData.append("description", description);

//     const response = await fetch("http://localhost:5000/upload", {
//       method: "POST",
//       body: formData,
//     });

//     const data = await response.json();

//     if (!data.IpfsHash) {
//       throw new Error("Failed to get IPFS hash from server");
//     }

//     console.log("✅ Uploaded to IPFS:", data.IpfsHash);
//     return data.IpfsHash;

//   } catch (error) {
//     console.error("❌ IPFS Upload Error:", error);
//     throw error;
//   }
// }

// export async function fetchFromIPFS(ipfsHash) {
//   try {
//     if (!ipfsHash) throw new Error("IPFS hash is required");

//     const res = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
//     return await res.json();
    
//   } catch (error) {
//     console.error("❌ IPFS Fetch Error:", error);
//     throw error;
//   }
// }

// export function getIPFSUrl(ipfsHash, path = '') {
//   return `https://gateway.pinata.cloud/ipfs/${ipfsHash}${path ? `/${path}` : ''}`;
// }
