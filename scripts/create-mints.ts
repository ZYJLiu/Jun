import { Keypair, PublicKey } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import {
  usdcMintKeypair,
  diamMintKeypair,
  junMintKeypair,
  connection,
  randomPayer,
  findDiamMintAuthorityPDA,
  findJunMintAuthorityPDA,
} from "./config";

// createMints helper function
const createMints = async () => {
  // create USDC Mint Account
  const usdcMintAddress = await createMintAcct(
    usdcMintKeypair,
    usdcMintKeypair.publicKey
  );

  // find Diam PDA
  const [diamPDA, diamBump] = await findDiamMintAuthorityPDA();
  // const [diamPDA, diamPDABump] = await PublicKey.findProgramAddress(
  //     [diamMintAddress.toBuffer()],
  //     program.programId
  // );

  // create DIAM Mint Account with PDA as Authority
  const diamMintAddress = await createMintAcct(diamMintKeypair, diamPDA);

  // find Jun PDA
  const [junPDA, junBump] = await findJunMintAuthorityPDA();

  // create Jun Mint Account with PDA as Authority
  const junMintAddress = await createMintAcct(junMintKeypair, junPDA);

  console.log(`usdc Mint Address: ${usdcMintAddress}`);
  console.log(`diam Mint Address: ${diamMintAddress}`);
  console.log(`jun Mint Address: ${junMintAddress}`);
};

// helper function to create Token Mint ccounts
const createMintAcct = async (
  keypairToAssign: Keypair,
  authorityToAssign: PublicKey
): Promise<PublicKey> => {
  return await createMint(
    connection, //connection to Solana
    await randomPayer(), //user randomPayer helper to create accounts for test
    authorityToAssign, // mint authority
    null, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
    8, // decimals
    keypairToAssign // address of the mint (optional parameter,  defaulting to a new random one)
  );
};

export { createMints };
