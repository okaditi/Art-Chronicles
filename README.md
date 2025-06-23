# 🎨 Art Chronicles

[![Live Demo](https://img.shields.io/badge/Live-Demo-%236e45e2)](https://muse-seven-mu.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Art Chronicles is a decentralized NFT minting platform that empowers digital artists to turn their creative work into blockchain-based assets. Upload, mint, and showcase your art in a fully on-chain, IPFS-backed gallery experience.

> “Where every artwork tells a story — and every story lives forever.”

---

## 🔗 Live Demo  
🌐 [Art Chronicles](https://muse-seven-mu.vercel.app/)

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS (custom theming), JavaScript  
- **Web3 Integration:** Web3.js, MetaMask, Ethereum (Sepolia Testnet)  
- **Smart Contract:** Solidity (ERC-721), Hardhat  
- **Storage:** IPFS via Pinata  
- **Backend:** Node.js + Express server  
- **Deployment:** Vercel (frontend)

---

## 🚀 Features

- Drag & Drop + File Input for artwork upload
- IPFS upload for both media and metadata
- Smart contract minting to Sepolia network
- My Gallery: dynamically displays user’s NFTs
- Owner address & IPFS link shown per NFT
- Responsive design & dark theme support

---

## 💡 Smart Contract

- Contract Name: `ArtGallery`
- Inherits from OpenZeppelin’s `ERC721`
- Stores: `title`, `description`, `ipfsHash`, `owner`
- Public Functions:
  - `mintArtwork(string ipfsHash, string title, string description)`
  - `getArtwork(uint tokenId)`
  - `tokenURI(uint tokenId)`

🧾 **Deployed Contract Address:**  
`0xCDc6E9B074F2422f2BD1EdfCC9C9813ac0E52f57`

---

## 🖼️ Screenshots

- Upload Page
- <img width="959" alt="image" src="https://github.com/user-attachments/assets/ce174ff1-d43f-41a5-97e2-d6259607fb22" />
<img width="947" alt="image" src="https://github.com/user-attachments/assets/cbe93f22-04b5-4ee3-b8c8-32088acffed2" />

- NFT Gallery
- <img width="947" alt="image" src="https://github.com/user-attachments/assets/12979017-a6c1-4271-8fd4-357a6c3118cb" />

- MetaMask prompt
- <img width="959" alt="image" src="https://github.com/user-attachments/assets/7d764225-7ae3-4096-8daa-fab9dc60b8f4" />

- Responsive layout
<img width="947" alt="image" src="https://github.com/user-attachments/assets/ae4cf825-a46b-4815-b993-da436a2a6f15" />

---
