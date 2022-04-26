import { Signer, PublicKey, Keypair } from "@solana/web3.js";
import {
  Account,
  createMint,
  getMint,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { connection, randomPayer } from "../scripts/config";

class TokenHelper {
  mint: PublicKey;

  constructor(mint: PublicKey) {
    this.mint = mint;
  }

  // get Token Mint Address
  getMint = async (): Promise<PublicKey> => {
    return (await getMint(connection, this.mint)).address;
  };

  // get Token Account balance given Token Account addresds
  balance = async (tokenBag: PublicKey) => {
    return parseInt(
      (await connection.getTokenAccountBalance(tokenBag)).value.amount
    );
  };

  // get Token Account or Create Token Account if one does not exist
  getOrCreateTokenBag = async (
    owner: PublicKey,
    isPDA: boolean = false
  ): Promise<Account> => {
    // Get or create the account for token of type mint for owner
    return await getOrCreateAssociatedTokenAccount(
      connection, // connection to Solana
      await randomPayer(), // randomPayer for testing
      this.mint, // Token Mint
      owner, // user with Authority over this Token Account
    );
  };
}

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

export { TokenHelper };
