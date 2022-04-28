import { expect, assert } from "chai";
import * as anchor from "@project-serum/anchor";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  getBalance,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getMint,
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import {
  diamMintAddress,
  junMintAddress,
  usdcMintAddress,
  program,
  findDiamMintAuthorityPDA,
  findJunMintAuthorityPDA,
} from "../scripts/config";
import { User } from "./user";
import { createMints } from "../scripts/create-mints";
import { airdropusdc } from "../scripts/airdrop-USDC";
import { TokenHelper } from "./token_helper";
import { connection, randomPayer, userWallet } from "../scripts/config";

describe("diam", () => {
  // pretest setup
  before(async () => {
    // //create Token Mints
    // await createMints();
    // // add USDC to User USDC Token Account
    // await airdropusdc();
    // user is connected wallet
    // const user = new User();
    // const [junMint, jun_bump] = await PublicKey.findProgramAddress(
    //   [Buffer.from(anchor.utils.bytes.utf8.encode("JUN"))],
    //   program.programId
    // );
    // const [diamMint, diam_bump] = await PublicKey.findProgramAddress(
    //   [Buffer.from(anchor.utils.bytes.utf8.encode("DIAM"))],
    //   program.programId
    // );
    // try {
    //   await program.rpc.createMints({
    //     accounts: {
    //       junMint: junMint,
    //       diamMint: diamMint,
    //       user: user.wallet.publicKey,
    //       systemProgram: anchor.web3.SystemProgram.programId,
    //       rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    //       tokenProgram: TOKEN_PROGRAM_ID,
    //     },
    //   });
    //   // get Token Mint Address
    //   console.log("");
    //   const jun = await getMint(connection, junMint);
    //   console.log("JUN Mint Authority:", jun.mintAuthority.toString());
    //   console.log("JUN Mint Address:", junMint.toString());
    //   // get Token Mint Address
    //   const diam = await getMint(connection, diamMint);
    //   console.log("DIAM Mint Authority:", diam.mintAuthority.toString());
    //   console.log("DIAM Mint Address:", diamMint.toString());
    //   assert.isTrue(jun.mintAuthority.equals(junMint));
    //   assert.isTrue(diam.mintAuthority.equals(diamMint));
    // } catch (error) {
    //   console.log(error);
    // }
  });

  // it("It creates the program USDC token bag", async () => {
  //   // user is connected wallet
  //   const user = new User();
  //   // find Program USDC Token Account Address [PDA, bump]
  //   const [usdcPDA, _] = await getProgramUsdcTokenBagPDA();

  //   // call program createUsdcTokenBag instruction
  //   try {
  //     await program.rpc.createUsdcTokenBag({
  //       accounts: {
  //         programUsdcTokenBag: usdcPDA, // init USDC Token Account with PDA
  //         usdcMint: usdcMintAddress, // USDC Token Mint
  //         payer: user.wallet.publicKey, // connected user is payer

  //         // Solana accounts
  //         systemProgram: SystemProgram.programId, //system program required for creating accounts
  //         tokenProgram: TOKEN_PROGRAM_ID, // token program required to interact with Token Accounts
  //         rent: SYSVAR_RENT_PUBKEY,
  //       },
  //       // signers: [user.wallet],
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   // check that created USDC Token Account has balance of 0
  //   // const tokenHelper = new TokenHelper(usdcMintAddress);
  //   // expect(await tokenHelper.balance(usdcPDA)).to.be.eql(0);
  // });

  // it("It creates the program USDC token bag", async () => {
  //   // 0. Prepare Token Bags
  //   const user = new User();
  //   await user.getOrCreateUsdcTokenBag();
  //   await user.getOrCreateDiamTokenBag();
  //   await user.getOrCreateJunTokenBag();
  // });

  // it("Token", async () => {
  //   try {
  //     const usdc = await getOrCreateAssociatedTokenAccount(
  //       connection, // connection to Solana
  //       userWallet, // randomPayer for testing
  //       usdcMintAddress, // Token Mint
  //       userWallet.publicKey // user with Authority over this Token Account
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  // it("Token", async () => {
  //   try {
  //     const diam = await getOrCreateAssociatedTokenAccount(
  //       connection, // connection to Solana
  //       userWallet, // randomPayer for testing
  //       diamMintAddress, // Token Mint
  //       userWallet.publicKey // user with Authority over this Token Account
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  // it("Token", async () => {
  //   try {
  //     const jun = await getOrCreateAssociatedTokenAccount(
  //       connection, // connection to Solana
  //       userWallet, // randomPayer for testing
  //       junMintAddress, // Token Mint
  //       userWallet.publicKey // user with Authority over this Token Account
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  it("It swaps USDC for DIAM and JUN", async () => {
    // // 0. Prepare Token Bags
    const user = new User();
    // await user.getOrCreateUsdcTokenBag();
    // await user.getOrCreateDiamTokenBag();
    // await user.getOrCreateJunTokenBag();

    // const usdc = await getOrCreateAssociatedTokenAccount(
    //   connection, // connection to Solana
    //   userWallet, // randomPayer for testing
    //   usdcMintAddress, // Token Mint
    //   userWallet // user with Authority over this Token Account
    // );

    // const jun = await getOrCreateAssociatedTokenAccount(
    //   connection, // connection to Solana
    //   userWallet, // randomPayer for testing
    //   junMintAddress, // Token Mint
    //   userWallet // user with Authority over this Token Account
    // );

    // const diam = await getOrCreateAssociatedTokenAccount(
    //   connection, // connection to Solana
    //   userWallet, // randomPayer for testing
    //   diamMintAddress, // Token Mint
    //   userWallet // user with Authority over this Token Account
    // );

    // // 1. Get current user Token Balance (0 DIAMS, 1_000_000 USDC)
    // console.log("Balance Before Transaction");
    // const userusdcs = await user.usdcBalance();
    // console.log("USDC:", userusdcs);
    // const userdiam = await user.diamBalance();
    // console.log("DIAM:", userdiam);
    // const userjun = await user.junBalance();
    // console.log("JUN:", userjun);
    // console.log("");

    // // For the DIAM Mint PDA
    // const [diamPDA, diamPDABump] = await findDiamMintAuthorityPDA();
    // // console.log(diamPDA, diamPDABump);

    // // For the JUN Mint PDA
    // const [junPDA, junPDABump] = await findJunMintAuthorityPDA();
    // // console.log(junPDA, junPDABump);

    const [junMint, jun_bump] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("JUN"))],
      program.programId
    );

    const [diamMint, diam_bump] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("DIAM"))],
      program.programId
    );

    // For the USDC Token Account PDA
    const [usdcBagPDA, usdcBagBump] = await getProgramUsdcTokenBagPDA();
    // console.log(usdcBagPDA, usdcBagBump);

    const jun = await getAssociatedTokenAddress(
      junMintAddress,
      userWallet.publicKey
    );

    const diam = await getAssociatedTokenAddress(
      diamMintAddress,
      userWallet.publicKey
    );

    const usdc = await getAssociatedTokenAddress(
      usdcMintAddress,
      userWallet.publicKey
    );

    try {
      // 2. Execute swap USDC for DIAM
      await program.rpc.diam(
        diam_bump,
        jun_bump,
        usdcBagBump,
        new anchor.BN(50_000_000_000),
        {
          accounts: {
            // Token Program required to interact with Token Accounts
            tokenProgram: TOKEN_PROGRAM_ID,

            // Mint DIAM to User from Program
            diamMint: diamMintAddress,
            diamMintAuthority: diamMint,
            userDiamTokenBag: diam,

            // Mint JUN to User from Program
            junMint: junMintAddress,
            junMintAuthority: junMint,
            userJunTokenBag: jun,

            // Transfer USDC from User to Program
            userUsdcTokenBag: usdc,
            userUsdcTokenBagAuthority: user.wallet.publicKey,
            programUsdcTokenBag: usdcBagPDA,
            usdcMint: usdcMintAddress,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }

    const balance = await connection.getTokenAccountBalance(usdc);
    console.log("USDC:", balance);

    const balance1 = await connection.getTokenAccountBalance(diam);
    console.log("DIAM:", balance1);

    const balance2 = await connection.getTokenAccountBalance(jun);
    console.log("JUN:", balance1);

    // 3. Tests

    // // We expect the user to have received 5_000 DIAM and 5_000 JUN
    // // expect(await user.diamBalance()).to.be.eql(userdiam + 5_000);
    // expect(await user.junBalance()).to.be.eql(userjun + 5_000);

    // // We expect the user to have paid 5_000 USDC
    // expect(await user.usdcBalance()).to.be.eql(userusdcs - 5_000);

    // // We expect the program to have received 5_000 USDC
    // const tokenHelper = new TokenHelper(usdcMintAddress);
    // expect(await tokenHelper.balance(usdcBagPDA)).to.be.eql(5_000);

    // //Balance after transaction
    // console.log("Balance After Transaction");
    // const post_userusdcs = await user.usdcBalance();
    // console.log("USDC:", post_userusdcs);
    // const post_userdiam = await user.diamBalance();
    // console.log("DIAM:", post_userdiam);
    // const post_userjun = await user.junBalance();
    // console.log("JUN:", post_userjun);
    // console.log("");
  });

  it("It redeems DIAM", async () => {
    // 0. Prepare Token Bags
    const user = new User();
    // await user.getOrCreateDiamTokenBag();
    // await user.getOrCreateJunTokenBag();
    // await user.getOrCreateUsdcTokenBag();

    // // create merchant and USDC Token Account for merchant
    // const shop = await randomPayer();
    // const usdcToken = new TokenHelper(usdcMintAddress);
    // const shopUsdcTokenBag = (
    //   await usdcToken.getOrCreateTokenBag(shop.publicKey)
    // ).address;
    // // console.log(shopUsdcTokenBag);
    // // const beforeBalance = await usdcToken.balance(shopUsdcTokenBag);
    // // console.log(beforeBalance);

    // // For the TRANSFER
    // const [usdcBagPDA, usdcBagBump] = await getProgramUsdcTokenBagPDA();

    // // 1. Get current diam amount
    // console.log("User Balance Before Transaction");
    // const userusdcs = await user.usdcBalance();
    // console.log("USDC:", userusdcs);
    // const userdiam = await user.diamBalance();
    // console.log("DIAM:", userdiam);
    // const userjun = await user.junBalance();
    // console.log("JUN:", userjun);
    // console.log("");

    // console.log("Shop Balance Before Transaction");
    // const shopusdc = await usdcToken.balance(shopUsdcTokenBag);
    // console.log("USDC:", shopusdc);
    // console.log("");

    const [diamMint, diam_bump] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("DIAM"))],
      program.programId
    );

    // For the USDC Token Account PDA
    const [usdcBagPDA, usdcBagBump] = await getProgramUsdcTokenBagPDA();
    // console.log(usdcBagPDA, usdcBagBump);

    const diam = await getAssociatedTokenAddress(
      diamMintAddress,
      userWallet.publicKey
    );

    const usdc = await getAssociatedTokenAddress(
      usdcMintAddress,
      userWallet.publicKey
    );

    // 2. Execute redeem instruction
    await program.rpc.redeem(usdcBagBump, new anchor.BN(30_000_000), {
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,

        // BURNING USER'S DIAM
        diamMint: diamMintAddress,
        userDiamTokenBag: diam,
        userDiamTokenBagAuthority: user.wallet.publicKey,

        // TRANSFER USDC TO USERS
        programUsdcTokenBag: usdcBagPDA,
        userUsdcTokenBag: usdc,
        usdcMint: usdcMintAddress,
      },
      // signers: [userWallet],
    });

    const balance = await connection.getTokenAccountBalance(usdc);
    console.log("USDC:", balance);

    const balance1 = await connection.getTokenAccountBalance(diam);
    console.log("DIAM:", balance1);

    // 3. Tests

    // We expect the user to have redeem DIAM to the program.
    // expect(await user.diamBalance()).to.be.eql(userdiam - 5_000);
    // expect(await usdcToken.balance(shopUsdcTokenBag)).to.be.eql(5_000);

    // We expect the user to have received 5_000 usdc USDC back.
    // expect(await user.usdcBalance()).to.be.eql(userusdcs + 5_000);

    // //Balance after transaction
    // console.log("User Balance After Transaction");
    // const post_userusdcs = await user.usdcBalance();
    // console.log("USDC:", post_userusdcs);
    // const post_userdiam = await user.diamBalance();
    // console.log("DIAM:", post_userdiam);
    // const post_userjun = await user.junBalance();
    // console.log("JUN:", post_userjun);
    // console.log("");

    // console.log("Shop Balance After Transaction");
    // const post_shopusdc = await usdcToken.balance(shopUsdcTokenBag);
    // console.log("USDC:", post_shopusdc);
  });

  // it("Program Creates Mints", async () => {
  //   // user is connected wallet
  //   const user = new User();

  //   const [junMint, jun_bump] = await PublicKey.findProgramAddress(
  //     [Buffer.from(anchor.utils.bytes.utf8.encode("JUN"))],
  //     program.programId
  //   );

  //   const [diamMint, diam_bump] = await PublicKey.findProgramAddress(
  //     [Buffer.from(anchor.utils.bytes.utf8.encode("DIAM"))],
  //     program.programId
  //   );

  //   try {
  //     await program.rpc.createMints({
  //       accounts: {
  //         junMint: junMint,
  //         diamMint: diamMint,
  //         user: user.wallet.publicKey,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //         rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //       },
  //     });

  //     // get Token Mint Address
  //     console.log("");
  //     const jun = await getMint(connection, junMint);
  //     console.log("JUN Mint Authority:", jun.mintAuthority.toString());
  //     console.log("JUN Mint Address:", junMint.toString());

  //     // get Token Mint Address
  //     const diam = await getMint(connection, diamMint);
  //     console.log("DIAM Mint Authority:", diam.mintAuthority.toString());
  //     console.log("DIAM Mint Address:", diamMint.toString());

  //     assert.isTrue(jun.mintAuthority.equals(junMint));
  //     assert.isTrue(diam.mintAuthority.equals(diamMint));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
});

// helper function to find Program PDA for USDC Token Account
const getProgramUsdcTokenBagPDA = async (): Promise<[PublicKey, number]> => {
  const seed = usdcMintAddress;

  return await PublicKey.findProgramAddress(
    [seed.toBuffer()],
    program.programId
  );
};
