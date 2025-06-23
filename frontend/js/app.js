import ArtGalleryABI from './abi.js';

let web3;
let contract;
let selectedFile = null;

window.addEventListener('DOMContentLoaded', async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    const contractAddress = '0xCDc6E9B074F2422f2BD1EdfCC9C9813ac0E52f57';
    contract = new web3.eth.Contract(ArtGalleryABI, contractAddress);
    window.contract = contract;

    await loadUserGallery(); 
  } else {
    alert('Please install MetaMask to use this DApp.');
  }

  const uploadBox = document.getElementById('uploadBox');
  const fileInput = document.getElementById('artFile');

  fileInput.addEventListener('change', handleFileSelect);

  uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('dragover');
  });

  uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('dragover');
  });

  uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      selectedFile = e.dataTransfer.files[0];
      previewFile(selectedFile);
    }
  });

  document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await uploadAndMint();
  });
});

function handleFileSelect() {
  const fileInput = document.getElementById('artFile');
  selectedFile = fileInput.files[0];
  previewFile(selectedFile);
}

function previewFile(file) {
  const uploadBox = document.getElementById('uploadBox');
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'video/mp4'];
  if (!validTypes.includes(file.type)) {
    alert('Invalid file type. Use JPG, PNG, GIF, SVG, or MP4.');
    resetFileInput();
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadBox.innerHTML = `
      <div class="file-preview">
        ${file.type.includes('image') ?
          `<img src="${e.target.result}" alt="Preview">` :
          `<video controls><source src="${e.target.result}" type="${file.type}"></video>`}
        <p>${file.name}</p>
        <button class="secondary-btn small" id="changeFileBtn">
          <i class="fas fa-exchange-alt"></i> Change File
        </button>
      </div>
    `;

    document.getElementById('changeFileBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      resetFileInput();
    });
  };
  reader.readAsDataURL(file);
}

function resetFileInput() {
  const uploadBox = document.getElementById('uploadBox');
  selectedFile = null;
  uploadBox.innerHTML = `
    <i class="fas fa-image upload-icon"></i>
    <h3>Drag & Drop Artwork Here</h3>
    <p>or click to browse files (JPG, PNG, GIF, SVG, MP4)</p>
    <input type="file" id="artFile" accept="image/*,video/*">
  `;

  document.getElementById('artFile').addEventListener('change', handleFileSelect);
}

// ✅ Mint logic
async function uploadAndMint() {
  if (!selectedFile) {
    alert('Please select a file to upload.');
    return;
  }

  const title = document.getElementById('artName').value.trim();
  const description = document.getElementById('artDescription').value.trim();

  if (!title || !description) {
    alert('Please fill in both title and description.');
    return;
  }

  try {
    console.log('Uploading media to IPFS...');
    const formData = new FormData();
    formData.append('file', selectedFile);

    const ipfsUpload = await axios.post('http://localhost:5000/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const ipfsHash = ipfsUpload.data.IpfsHash;
    const mediaURL = `https://ipfs.io/ipfs/${ipfsHash}`;
    console.log('Media uploaded to:', mediaURL);

    const account = window.ethereum.selectedAddress;

    console.log('Sending mint transaction...');
    await contract.methods
      .mintArtwork(ipfsHash, title, description)
      .send({ from: account });

    alert('🎉 NFT minted successfully!');
    resetFileInput();
    await loadUserGallery(); 
  } catch (err) {
    console.error('Minting failed:', err);
    alert('Minting failed. Check console for details.');
  }
}

async function loadUserGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  try {
    const total = await contract.methods.totalSupply().call();

    for (let tokenId = 1; tokenId <= total; tokenId++) {
      const artwork = await contract.methods.getArtwork(tokenId).call();
      const mediaURL = `https://ipfs.io/ipfs/${artwork.ipfsHash}`;

      const card = document.createElement('div');
      card.classList.add('gallery-item');
      card.innerHTML = `
        <div class="gallery-card">
          ${mediaURL.endsWith('.mp4') ?
            `<video controls><source src="${mediaURL}" type="video/mp4"></video>` :
            `<img src="${mediaURL}" alt="${artwork.title}" />`}
          <div class="gallery-info">
            <h4>${artwork.title}</h4>
            <p>${artwork.description}</p>
            <div class="gallery-meta">
              <div><strong>Owner:</strong> ${artwork.owner.slice(0, 6)}...${artwork.owner.slice(-4)}</div>
              <div><strong>IPFS:</strong> <a href="${mediaURL}" target="_blank">View</a></div>
            </div>
          </div>
        </div>
      `;

      gallery.appendChild(card);
    }

    if (!gallery.hasChildNodes()) {
      gallery.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-image"></i>
          <p>No NFTs have been minted yet.</p>
        </div>
      `;
    }
  } catch (err) {
    console.error('Failed to load gallery:', err);
    gallery.innerHTML = `<p class="error">Error loading gallery.</p>`;
  }
}

window.uploadAndMint = uploadAndMint;
