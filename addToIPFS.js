const IPFS = require('ipfs-http-client');

// Connect to local IPFS node or Infura
const ipfs = IPFS.create({ host: 'localhost', port: '5001', protocol: 'http' });

async function uploadToIPFS(patientData) {
    try {
        const { path } = await ipfs.add(JSON.stringify(patientData));
        console.log("IPFS Hash:", path);
        return path;
    } catch (error) {
        console.error("Error uploading to IPFS:", error);
    }
}

module.exports = uploadToIPFS;
