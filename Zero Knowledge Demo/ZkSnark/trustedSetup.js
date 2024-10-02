import { initialize } from "zokrates-js";
import fs, { write } from 'fs';

const loadCircuit = () => {
  try {
    const data = fs.readFileSync('zeroKnowledge.zok', 'utf8');
    return data;
  } catch (err) {
    console.error('Error reading file:', err);
    return null;
  }
}

const writeFile = (fileData, fileName) => {
  fs.writeFile(fileName, JSON.stringify(fileData, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File saved to ' + fileName);
    }
  });
}

initialize().then((zokratesProvider) => {
  const source = loadCircuit();

  // compilation
  const artifacts = zokratesProvider.compile(source);
      // this is bcz saving uint8 can mess array into a mapping, so we convert into array
  if (artifacts.program instanceof Uint8Array) {    
    artifacts.program = Array.from(artifacts.program); 
  }
  // writeFile(artifacts, "artifacts.json")
  writeFile(artifacts, "../ZeroKnowledge-Proof/src/ZkData/artifacts.json")


  // run setup
  const keypair = zokratesProvider.setup(artifacts.program);
  if (keypair.pk instanceof Uint8Array) {    
    keypair.pk = Array.from(keypair.pk); 
  }

  // writeFile(keypair, "keyPair.json")
  writeFile(keypair, "../ZeroKnowledge-Proof/src/ZkData/keyPair.json")
  

  // export solidity verifier (for verification on Blockchain)
  const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk);
  fs.writeFileSync('Verifier.sol', verifier, { encoding: 'utf8' });


  // ===================== Example of how to generate proof in JS =============== //

  // computation
  const { witness, output } = zokratesProvider.computeWitness(artifacts, ["2", "4"]);

  // generate proof
  const proof = zokratesProvider.generateProof(
    artifacts.program,
    witness,
    keypair.pk
  );
  writeFile(proof, "testProof.json")

  //verify off-chain
  const isVerified = zokratesProvider.verify(keypair.vk, proof);
  // console.log(isVerified)
});