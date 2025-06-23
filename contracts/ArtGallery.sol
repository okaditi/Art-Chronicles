// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArtGallery is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Artwork {
        string ipfsHash;
        string title;
        string description;
        address owner;
    }

    mapping(uint256 => Artwork) private _artworks;

    constructor() ERC721("MuseArt", "MUSE") {}

    /// @notice Mint a new artwork NFT with metadata stored on IPFS
    /// @param ipfsHash IPFS hash of the artwork image
    /// @param title Title of the artwork
    /// @param description Description of the artwork
    function mintArtwork(
        string memory ipfsHash,
        string memory title,
        string memory description
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);

        _artworks[newItemId] = Artwork({
            ipfsHash: ipfsHash,
            title: title,
            description: description,
            owner: msg.sender
        });

        return newItemId;
    }

    /// @notice Get the metadata URI of a token
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return string(abi.encodePacked("ipfs://", _artworks[tokenId].ipfsHash));
    }

    /// @notice Fetch full artwork metadata by token ID
    function getArtwork(uint256 tokenId) public view returns (
        string memory ipfsHash,
        string memory title,
        string memory description,
        address owner
    ) {
        require(_exists(tokenId), "Token does not exist");
        Artwork memory artwork = _artworks[tokenId];
        return (artwork.ipfsHash, artwork.title, artwork.description, artwork.owner);
    }

    /// ✅ NEW: Return total number of tokens minted
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}
