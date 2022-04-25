import { mintTo } from "@solana/spl-token";
import { usdcMintKeypair, connection, randomPayer } from "./config";
import { TokenHelper } from "../tests/token_helper";
import { User } from "../tests/user";

const airdropusdc = async () => {
  // user is connected wallet
  const user = new User();

  // create USDC Token Account for User
  await user.getOrCreateUsdcTokenBag();

  // mint USDC to User USDC Token Account
  await mintTo(
    connection, // connection to Solana
    await randomPayer(), // randomPayer as payer for test
    usdcMintKeypair.publicKey, // USDC Token Mint
    user.usdcTokenBag, // User USDC Token Account (destination)
    usdcMintKeypair, // Mint Authority (required as signer)
    5_000,
    []
  );

  const balance = await new TokenHelper(usdcMintKeypair.publicKey).balance(
    user.usdcTokenBag
  );
  console.log(
    `USDC Token Account'${user.usdcTokenBag.toString()}' balance: ${balance}`
  );
};

// const run = async () => {
//     try {
//         await airdropusdc();
//         process.exit(0);
//     } catch (error) {
//         console.error(error);
//         process.exit(1);
//     }
// };
// run();

export { airdropusdc };
