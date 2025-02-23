# Dapp-for-Medical-Record
This repository contains everything you need to create a Web3 website for adding and reviewing patient data. It uses truffle for creating the smart contracts., web3 for web interfacing, ganache for generating tokens and Metamask for transaction. 

## Features
- Secure storage of patient records using Ethereum smart contracts
- Decentralized file storage using IPFS
- Web3.js integration for interacting with the Ethereum blockchain
- Deployment on a local blockchain (Ganache) for testing

## Technologies Used
- **Solidity** - Smart contract development
- **Ethereum (Ganache/Truffle)** - Blockchain development and testing
- **IPFS** - Decentralized file storage
- **Node.js & Web3.js** - Backend interaction with Ethereum

## Folder Structure
```
project-root/
│── contracts/        # Solidity smart contracts
│── migrations/       # Deployment scripts
│── scripts/          # Scripts for interacting with smart contracts
│── build/            # Compiled contract artifacts
│── client/           # Frontend application (if applicable)
│── truffle-config.js # Truffle configuration
│── README.md         # Project documentation
```

## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Truffle](https://www.trufflesuite.com/) (`npm install -g truffle`)
- [Ganache](https://trufflesuite.com/ganache/)
- [IPFS](https://docs.ipfs.tech/install/) (`wget` or `brew install ipfs`)
- [MetaMask](https://metamask.io/) (for interacting with the blockchain)

If you are in windows, make sure u use `bash` which can be which can be installed by running `wsl --install` in the command prompt. This will install bash and open it by just typing bash. 


## Installation
   ```
2. Install dependencies:
   ```sh
   npm install
   node install
   npm install -g truffle
   
   ```

## Deployment
### 1. Compile Smart Contracts
   ```sh
   truffle compile
   ```

   After the compiling, the files will be auto generated and make sure u copy 
      1. all the .sol files in the contract folder.
      2. interact.js in the scripts folder
      3.addtoipfs.js in the ipfs folder(create it if required)
      4. Both the migration files in the migration folder

      **Kindly note that the build folder will be created only after the next 2 steps**
   
### 2. Start a Local Blockchain
   Open Ganache and ensure it's running on `http://127.0.0.1:7545`.

### 3. Deploy Smart Contracts
   ```sh
   truffle migrate --reset
   ```
   After running the above command, the should be a folder named `build` that would contain the .json files of the equivalent contracts that we made using .sol
   Next you should open the `PatientRecords.json` under the build folder and find the patient address. It will be in the format of "0x1711B859CFc6CB055ceBAE89bc4A4E91XXXXXXXX". Copy the address and paste in the `interact.js` in the 
   const patientRecordsAddress = "0x1711B859CFc6CB055ceBAE89bc4A4E91CCCCCCCC"; line


   
## Usage
### Running the Script to Add Patients
```sh
node scripts/addPatients.js
```

## IPFS Setup
### 1. Initialize IPFS
```sh
ipfs init
```
### 2. Start the IPFS Daemon
```sh
ipfs daemon
```
### 3. Add a File to IPFS
```sh
ipfs add file.txt
```
### 4. Retrieve the File
```sh
ipfs cat <IPFS_HASH>
```
After you have done everything, add the metamask extension in your browser and connect it with the ganache account to generate token. After you have integrated ganache with metamask, create a frontend for your project and run it. The sample frontend is given as app.js and should be placed inside the `client/src/`

Next if you want to add the patient data, it will initiate a transaction through which u can add the data onto the blockchain.

## Contributing
Pull requests are welcome! Please open an issue first to discuss any changes.

## License
This project is licensed under the MIT License.


