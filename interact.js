const Web3 = require("web3");
const fs = require("fs");
const path = require("path");

// Connect to Ganache or Ethereum testnet
const web3 = new Web3.Web3("http://127.0.0.1:7545");
console.log("Connection successful");

// Load contract ABI and address
const contractPath = path.resolve(__dirname, "../build/contracts/PatientRecords.json");
const patientRecordsABI = JSON.parse(fs.readFileSync(contractPath, "utf8")).abi;
const patientRecordsAddress = "0x1711B859CFc6CB055ceBAE89bc4A4E9101Ed0751"; // Replace with your deployed contract address

// Initialize contract instance
const contract = new web3.eth.Contract(patientRecordsABI, patientRecordsAddress);

async function addPatient() {
    try {
        // Get accounts
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            console.error("No accounts found. Ensure you have accounts available in your Ethereum wallet.");
            return;
        }
        const account = accounts[0]; // Use the first account
        console.log("Using account:", account);

        console.log("Adding patient records...");

        const patients = [
            { name: "John Doe", age: 30, disease: "Flu" },
            { name: "Alice Smith", age: 25, disease: "COVID-19" },
        ];

        for (const patient of patients) {
            try {
                // Estimate gas
                let gasEstimate = await contract.methods
                    .addPatient(patient.name, patient.age, patient.disease)
                    .estimateGas({ from: account });

                // Convert gasEstimate from BigInt to number (if necessary)
                if (typeof gasEstimate === "bigint") {
                    gasEstimate = Number(gasEstimate);
                }

                const gasLimit = Math.round(gasEstimate * 1.2); // Add a 20% buffer

                // Send transaction
                const receipt = await contract.methods
                    .addPatient(patient.name, patient.age, patient.disease)
                    .send({ from: account, gas: gasLimit });

                console.log(`Added: ${patient.name}, ${patient.age}, ${patient.disease}`);
                console.log("Transaction Hash:", receipt.transactionHash);

                // Check for emitted events (assuming 'PatientAdded' is emitted)
                if (receipt.events && receipt.events.PatientAdded) {
                    const patientAddedEvent = receipt.events.PatientAdded.returnValues;
                    console.log("PatientAdded Event Data:", patientAddedEvent);

                    // Retrieve patient data using the patientId
                    const patientData = await contract.methods.getPatient(patientAddedEvent.id).call();
                    console.log("Retrieved Patient Data:", patientData);
                } else if (receipt.logs && receipt.logs.length > 0) {
                    console.warn("Direct event not found, decoding logs manually...");
                    const decodedLog = web3.eth.abi.decodeLog(
                        [
                            { indexed: true, type: "uint256", name: "id" },
                            { indexed: false, type: "string", name: "name" },
                            { indexed: false, type: "uint256", name: "age" },
                            { indexed: false, type: "string", name: "disease" },
                        ],
                        receipt.logs[0].data,
                        receipt.logs[0].topics.slice(1)
                    );

                    console.log("Manually Decoded Event Data:", decodedLog);
                } else {
                    console.error("No events found in the transaction receipt.");
                }
            } catch (gasError) {
                console.error(`Failed to process patient ${patient.name}:`, gasError.message);
            }
        }
    } catch (error) {
        console.error("Error interacting with contract:", error);

        if (error.reason) {
            console.error("Revert Reason:", error.reason); // Get revert reason if available
        } else if (error.data && error.data.message) {
            console.error("Revert Message (if available):", error.data.message);
        } else if (error.message) {
            console.error("Error Message:", error.message);
        }
    }
}

addPatient();
