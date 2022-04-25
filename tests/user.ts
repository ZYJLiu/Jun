import { PublicKey } from "@solana/web3.js";
import {
  usdcMintAddress,
  diamMintAddress,
  junMintAddress,
  userWallet,
} from "../scripts/config";
import { TokenHelper } from "./token_helper";
import { Wallet } from "@project-serum/anchor";

// User is connected wallet
class User {
  usdcToken: TokenHelper;
  usdcTokenBag: PublicKey;
  diamToken: TokenHelper;
  diamTokenBag: PublicKey;
  junToken: TokenHelper;
  junTokenBag: PublicKey;
  wallet: Wallet;

  constructor(wallet = userWallet) {
    this.usdcToken = new TokenHelper(usdcMintAddress);
    this.diamToken = new TokenHelper(diamMintAddress);
    this.junToken = new TokenHelper(junMintAddress);
    this.wallet = wallet;
  }

  // create User USDC Associated Token Account
  getOrCreateUsdcTokenBag = async () => {
    this.usdcTokenBag = (
      await this.usdcToken.getOrCreateTokenBag(this.wallet.publicKey)
    ).address;
  };

  // create User DIAM Associated Token Account
  getOrCreateDiamTokenBag = async () => {
    this.diamTokenBag = (
      await this.diamToken.getOrCreateTokenBag(this.wallet.publicKey)
    ).address;
  };

  // create User JUN Associated Token Account
  getOrCreateJunTokenBag = async () => {
    this.junTokenBag = (
      await this.junToken.getOrCreateTokenBag(this.wallet.publicKey)
    ).address;
  };

  usdcBalance = async () => {
    // call getOrCreateusdcTokenBag first
    return await this.usdcToken.balance(this.usdcTokenBag);
  };

  diamBalance = async () => {
    // call getOrCreatediamTokenbag first
    return await this.diamToken.balance(this.diamTokenBag);
  };

  junBalance = async () => {
    // call getOrCreatejunTokenbag first
    return await this.junToken.balance(this.junTokenBag);
  };
}

export { User };
