// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientRecords {
    struct Patient {
        string name;
        uint age;
        string disease;
    }

    mapping(uint => Patient) private patients; // Changed to `private` for better encapsulation
    uint public patientCount;

    // Event emitted when a new patient is added
    event PatientAdded(uint indexed id, string name, uint age, string disease);


    // Contract owner address
    address public owner;

    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _; // Continue execution
    }

    function addPatient(
        string memory _name,
        uint _age,
        string memory _disease
    ) public onlyOwner {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_age > 0 && _age < 150, "Invalid age"); // Example age range
        require(bytes(_disease).length > 0, "Disease cannot be empty");

        patientCount++;
        patients[patientCount] = Patient(_name, _age, _disease);

        emit PatientAdded(patientCount, _name, _age, _disease);
    }

    function getPatient(uint _id)
        public
        view
        returns (string memory name, uint age, string memory disease)
    {
        require(_id > 0 && _id <= patientCount, "Patient ID out of range");
        Patient memory p = patients[_id];
        return (p.name, p.age, p.disease);
    }

    // Function to update patient information
    function updatePatient(
        uint _id,
        string memory _name,
        uint _age,
        string memory _disease
    ) public onlyOwner {
        require(_id > 0 && _id <= patientCount, "Patient ID out of range");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_age > 0 && _age < 150, "Invalid age");
        require(bytes(_disease).length > 0, "Disease cannot be empty");

        Patient storage p = patients[_id];
        p.name = _name;
        p.age = _age;
        p.disease = _disease;
    }

    // Function to get all patients
    function getAllPatients() public view returns (Patient[] memory) {
        require(patientCount > 0, "No patients found");

        Patient[] memory allPatients = new Patient[](patientCount);
        for (uint i = 1; i <= patientCount; i++) {
            allPatients[i - 1] = patients[i];
        }
        return allPatients;
    }

    // Transfer contract ownership
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be the zero address");
        owner = _newOwner;
    }
}
