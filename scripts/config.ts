import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import * as anchor from "@project-serum/anchor";

// Solana Setup
anchor.setProvider(anchor.Provider.env());
const program = anchor.workspace.JunV0;
const connection = anchor.getProvider().connection;
const userWallet = anchor.workspace.JunV0.provider.wallet;

// randomPayer used to pay for account creation in test
// airdrop randomPayer 1 SOL
const randomPayer = async (lamports = LAMPORTS_PER_SOL) => {
  const wallet = Keypair.generate();
  const signature = await connection.requestAirdrop(wallet.publicKey, lamports);
  await connection.confirmTransaction(signature);
  return wallet;
};

// find Program PDA for USDC Token Account
const findUsdcMintAuthorityPDA = async (): Promise<[PublicKey, number]> => {
  return await getProgramDerivedAddress(usdcMintAddress);
};

// find Program PDA for DIAM Token Account
const findDiamMintAuthorityPDA = async (): Promise<[PublicKey, number]> => {
  return await getProgramDerivedAddress(diamMintAddress);
};

// find Program PDA for JUN Token Account
const findJunMintAuthorityPDA = async (): Promise<[PublicKey, number]> => {
  return await getProgramDerivedAddress(junMintAddress);
};

// helper function to find PDA
// seed for PDA is Token Mint
const getProgramDerivedAddress = async (
  seed: PublicKey
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [seed.toBuffer()],
    program.programId
  );
};

// // @ts-ignore
// const usdcData = JSON.parse(fs.readFileSync(".keys/usdc.json"));
// const usdcMintKeypair = Keypair.fromSecretKey(new Uint8Array(usdcData));
// const usdcMintAddress = usdcMintKeypair.publicKey;
// console.log(usdcMintAddress);
const usdcMintAddress = new PublicKey(
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
);

// // @ts-ignore
// const diamData = JSON.parse(fs.readFileSync(".keys/diam.json"));
// const diamMintKeypair = Keypair.fromSecretKey(new Uint8Array(diamData));
// const diamMintAddress = diamMintKeypair.publicKey;
const diamMintAddress = new PublicKey(
  "FviaKJxoMjUvhi1Rpd53WENJ1mFRp2h4LBANzLu5XRNq"
);

// // @ts-ignore
// const junData = JSON.parse(fs.readFileSync(".keys/jun.json"));
// const junMintKeypair = Keypair.fromSecretKey(new Uint8Array(junData));
// const junMintAddress = junMintKeypair.publicKey;
const junMintAddress = new PublicKey(
  "9UJR9kw8BYXpYoVPr4ZwJpCC9FEwgwuGJqMHsA2ff4Pc"
);

export {
  program,
  connection,
  userWallet,
  randomPayer,
  // usdcMintKeypair,
  usdcMintAddress,
  // diamMintKeypair,
  diamMintAddress,
  // junMintKeypair,
  junMintAddress,
  findUsdcMintAuthorityPDA,
  findDiamMintAuthorityPDA,
  findJunMintAuthorityPDA,
};
