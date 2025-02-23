import React, { useEffect, useState, useCallback } from "react";
import Web3 from "web3";
import contractABI from "./contracts/PatientRecords.json"; // Ensure correct path
import "./App.css"; // Modernized styling

const CONTRACT_ADDRESS = "0x305Bd38c0a253A4679AB692D8ae3501eEDa93DE6";

function App() {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [disease, setDisease] = useState("");
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  // Load blockchain on mount
  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const contractInstance = new web3Instance.eth.Contract(contractABI.abi, CONTRACT_ADDRESS);
          setWeb3(web3Instance);
          setContract(contractInstance);
        } catch (error) {
          console.error("Error connecting to blockchain:", error);
          alert("Failed to load blockchain data. Check console for details.");
        }
      } else {
        alert("MetaMask is required. Please install it.");
      }
    };

    loadBlockchainData();
  }, []);

  // Fetch patients when contract is set
  useEffect(() => {
    if (contract) {
      fetchPatients();
    }
  }, [contract]);

  const fetchPatients = useCallback(async () => {
    try {
      const patientCount = await contract.methods.patientCount().call();
      let patientList = [];

      for (let i = 1; i <= patientCount; i++) {
        const patient = await contract.methods.getPatient(i).call();
        patientList.push({
          id: i,
          name: patient[0],
          age: patient[1],
          disease: patient[2],
        });
      }
      setPatients(patientList);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }, [contract]);

  const addPatient = async (e) => {
    e.preventDefault();
    if (!name || !age || !disease) return alert("Please fill all fields!");

    try {
      await contract.methods.addPatient(name, age, disease).send({ from: account });
      alert("Patient added successfully!");

      setPatients([...patients, { id: patients.length + 1, name, age, disease }]); // Instantly update list
      setName("");
      setAge("");
      setDisease("");
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient. Check console for details.");
    }
  };

  return (
    <div className="container">
      <h1>🩺 Blockchain Patient Records</h1>
      <p>Connected Account: <strong>{account || "Not Connected"}</strong></p>

      <h2>Stored Patients</h2>
      <ul className="patient-list">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <li key={patient.id}>
              <strong>{patient.name}</strong>, {patient.age} years old - <em>{patient.disease}</em>
            </li>
          ))
        ) : (
          <p>No patients added yet.</p>
        )}
      </ul>

      <h2>Add New Patient</h2>
      <form onSubmit={addPatient}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <input type="text" placeholder="Disease" value={disease} onChange={(e) => setDisease(e.target.value)} />
        <button type="submit">➕ Add Patient</button>
      </form>
    </div>
  );
}

export default App;
