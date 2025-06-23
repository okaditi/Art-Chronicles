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
