import * as fs from 'fs';
import * as path from 'path';

export async function generateFrontendFiles(
  contractName: string,
  contract: any,
  network: string
) {
  const frontendDir = path.join(__dirname, '../../../frontend/src/contracts');
  
  // Create directories if they don't exist
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  // Write ABI
  const abi = JSON.parse(contract.interface.formatJson());
  fs.writeFileSync(
    path.join(frontendDir, `${contractName}.abi.json`),
    JSON.stringify(abi, null, 2)
  );

  // Write TypeScript types
  const typechainDir = path.join(__dirname, '../../typechain-types');
  if (fs.existsSync(typechainDir)) {
    fs.cpSync(
      typechainDir,
      path.join(frontendDir, 'types'),
      { recursive: true }
    );
  }

  // Write contract addresses
  const addressesPath = path.join(frontendDir, 'contract-addresses.json');
  let addresses = {};
  
  if (fs.existsSync(addressesPath)) {
    addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  }

  addresses[network] = {
    ...addresses[network],
    [contractName]: await contract.getAddress()
  };

  fs.writeFileSync(
    addressesPath,
    JSON.stringify(addresses, null, 2)
  );
} 