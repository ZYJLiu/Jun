use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("7Yo9DesUhQnAVjzwsL6NX2CEpa1c5gTEn47bqaMYa5eP");

#[program]
pub mod jun_v0 {
    // // REPLACE ADDRESS of usdc mint by running solana address -k .keys/jun.json
    // pub const JUN_MINT_ADDRESS: &str = "6yeBQtBiVMk9b8TN5HeJY2FoDqGayUErDyV7JuL6gw4Y";
    // // REPLACE ADDRESS of diam mint by running solana address -k .keys/diam.json
    // pub const DIAM_MINT_ADDRESS: &str = "97oBv9RwwYyXJLunGaDstjKwteye4acQdxZAewy1wJku";
    // // REPLACE ADDRESS of usdc mint by running solana address -k .keys/usdc.json
    // pub const USDC_MINT_ADDRESS: &str = "8tcH3BURNXa8d8hdCNzGonfwmscVbZo1KLdYi1d3iToV";
    
    pub const USDC_MINT_ADDRESS: &str = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";

    pub const SEED_JUN: &str = "JUN";
    pub const SEED_DIAM: &str = "DIAM";

    pub const JUN_MINT_PDA: &str = "9UJR9kw8BYXpYoVPr4ZwJpCC9FEwgwuGJqMHsA2ff4Pc";
    pub const DIAM_MINT_PDA: &str = "FviaKJxoMjUvhi1Rpd53WENJ1mFRp2h4LBANzLu5XRNq";

    use super::*;

    pub fn create_mints(_ctx: Context<CreateMints>) -> Result<()> {
        Ok(())
    }

    pub fn create_usdc_token_bag(ctx: Context<CreateusdcTokenBag>) -> Result<()> {
        Ok(())
    }

    pub fn diam(
        ctx: Context<diam>,
        diam_mint_authority_bump: u8,
        jun_mint_authority_bump: u8,
        program_usdc_bag_bump: u8,
        usdc_amount: u64,
    ) -> Result<()> {
        // 1. Ask SPL Token Program to mint DIAM to the user.

        // TODO: Change the formula
        let diam_amount = usdc_amount;
        let jun_amount = usdc_amount;

        // mint DIAM to user
        let seeds = &[b"DIAM".as_ref(), &[diam_mint_authority_bump]];
        let signer = [&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.diam_mint.to_account_info(),
                to: ctx.accounts.user_diam_token_bag.to_account_info(),
                authority: ctx.accounts.diam_mint_authority.to_account_info(),
            },
            &signer,
        );
        token::mint_to(cpi_ctx, diam_amount)?;

        // mint JUN to user
        let seeds = &[b"JUN".as_ref(), &[jun_mint_authority_bump]];
        let signer = [&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.jun_mint.to_account_info(),
                to: ctx.accounts.user_jun_token_bag.to_account_info(),
                authority: ctx.accounts.jun_mint_authority.to_account_info(),
            },
            &signer,
        );
        token::mint_to(cpi_ctx, jun_amount)?;

        // transfer USDC from the User to Program
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.user_usdc_token_bag.to_account_info(),
                authority: ctx.accounts.user_usdc_token_bag_authority.to_account_info(),
                to: ctx.accounts.program_usdc_token_bag.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, usdc_amount)?;

        Ok(())
    }

    pub fn redeem(ctx: Context<Redeem>, program_usdc_bag_bump: u8, diam_amount: u64) -> Result<()> {
        // 1. Ask SPL Token Program to burn user's DIAM.

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Burn {
                mint: ctx.accounts.diam_mint.to_account_info(),
                from: ctx.accounts.user_diam_token_bag.to_account_info(),
                authority: ctx.accounts.user_diam_token_bag_authority.to_account_info(),
            },
        );
        token::burn(cpi_ctx, diam_amount)?;

        // 2. Ask SPL Token Program to transfer USDC merchant.
        let usdc_mint_address = ctx.accounts.usdc_mint.key();
        let seeds = &[usdc_mint_address.as_ref(), &[program_usdc_bag_bump]];
        let signer = [&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.program_usdc_token_bag.to_account_info(),
                authority: ctx.accounts.program_usdc_token_bag.to_account_info(),
                to: ctx.accounts.user_usdc_token_bag.to_account_info(),
            },
            &signer,
        );

        let usdc_amount = diam_amount; // TODO: Change the formula
        token::transfer(cpi_ctx, usdc_amount)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateMints<'info> {
    #[account(
        init,
        seeds = [SEED_JUN.as_bytes()],
        bump,
        payer = user,
        mint::decimals = 6,
        mint::authority = jun_mint, 
        
    )]
    pub jun_mint: Account<'info, Mint>,
        #[account(
        init,
        seeds = [SEED_DIAM.as_bytes()],
        bump,
        payer = user,
        mint::decimals = 6,
        mint::authority = diam_mint, 
        
    )]
    pub diam_mint: Account<'info, Mint>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreateusdcTokenBag<'info> {
    // 1. PDA (so pubkey) for the soon-to-be created usdc token bag for our program.
    #[account(
        init,
        payer = payer,

        // We use the token mint as a seed for the mapping -> think "HashMap[seeds+bump] = pda"
        seeds = [ USDC_MINT_ADDRESS.parse::<Pubkey>().unwrap().as_ref() ],
        bump,

        // Token Program wants to know what kind of token this token bag is for
        token::mint = usdc_mint,

        // It's a PDA so the authority is itself!
        token::authority = program_usdc_token_bag,
    )]
    pub program_usdc_token_bag: Account<'info, TokenAccount>,

    // 2. USDC Mint
    #[account(
        address = USDC_MINT_ADDRESS.parse::<Pubkey>().unwrap(),
    )]
    pub usdc_mint: Account<'info, Mint>,

    // 3. The rent payer
    #[account(mut)]
    pub payer: Signer<'info>,

    // 4. Needed from Anchor for the creation of an Associated Token Account
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(diam_mint_authority_bump: u8, jun_mint_authority_bump: u8, program_usdc_bag_bump: u8)]
pub struct diam<'info> {
    // SPL Token Program
    pub token_program: Program<'info, Token>,

    // 1) TRANSFERING DIAM TO USER
    // Check that diam_mint provided is expected Mint Account
    #[account(
    mut,
    address = DIAM_MINT_PDA.parse::<Pubkey>().unwrap(),
    )]
    pub diam_mint: Box<Account<'info, Mint>>,

    // Mint Authority for DIAM Mint Account
    /// CHECK: only used as a signing PDA
    #[account(
    seeds = [ SEED_DIAM.as_bytes() ],
    bump = diam_mint_authority_bump,
    )]
    pub diam_mint_authority: UncheckedAccount<'info>,

    // User DIAM Associated Token Account
    #[account(mut)]
    pub user_diam_token_bag: Box<Account<'info, TokenAccount>>,

    // 2) TRANSFERING JUN TO USER
    // Check that diam_mint provided is expected Mint Account
    #[account(
    mut,
    address = JUN_MINT_PDA.parse::<Pubkey>().unwrap(),
    )]
    pub jun_mint: Box<Account<'info, Mint>>,

    // Mint Authority for JUN Mint Account
    /// CHECK: only used as a signing PDA
    #[account(
    seeds = [ SEED_JUN.as_bytes() ],
    bump = jun_mint_authority_bump,
    )]
    pub jun_mint_authority: UncheckedAccount<'info>,

    // User JUN Associated Token Account
    #[account(mut)]
    pub user_jun_token_bag: Box<Account<'info, TokenAccount>>,

    // 3) TRANSFERING USDC FROM USERS
    // Associated Token Account for User which holds USDC.
    #[account(mut)]
    pub user_usdc_token_bag: Box<Account<'info, TokenAccount>>,

    // Authority for User USDC Token Account required as signer
    pub user_usdc_token_bag_authority: Signer<'info>,

    // Program PDA USDC Token Account to receive USDC from users
    #[account(
        mut,
        seeds = [ usdc_mint.key().as_ref() ],
        bump = program_usdc_bag_bump,
    )]
    pub program_usdc_token_bag: Box<Account<'info, TokenAccount>>,

    // Address of the USDC Mint
    // Check that usdc_mint provided is expected Mint Account
    #[account(
        address = USDC_MINT_ADDRESS.parse::<Pubkey>().unwrap(),
    )]
    pub usdc_mint: Box<Account<'info, Mint>>,
}

#[derive(Accounts)]
#[instruction(program_usdc_bag_bump: u8)]
pub struct Redeem<'info> {
    // SPL Token Program
    pub token_program: Program<'info, Token>,

    // ***********
    // BURNING USER'S DIAM
    // ***********

    // see `token::Burn.mint`
    #[account(
        mut,
        address = DIAM_MINT_PDA.parse::<Pubkey>().unwrap(),
    )]
    pub diam_mint: Account<'info, Mint>,

    // see `token::Burn.to`
    #[account(mut)]
    pub user_diam_token_bag: Account<'info, TokenAccount>,

    // The authority allowed to mutate the above ⬆️
    pub user_diam_token_bag_authority: Signer<'info>,

    // ***********
    // TRANSFER USDC TO USERS
    // ***********

    // see `token::Transfer.from`
    #[account(
        mut,
        seeds = [ usdc_mint.key().as_ref() ],
        bump = program_usdc_bag_bump,
    )]
    pub program_usdc_token_bag: Account<'info, TokenAccount>,

    // see `token::Transfer.to`
    #[account(mut)]
    pub user_usdc_token_bag: Account<'info, TokenAccount>,

    // Require for the PDA above ⬆️
    #[account(
        address = USDC_MINT_ADDRESS.parse::<Pubkey>().unwrap(),
    )]
    pub usdc_mint: Box<Account<'info, Mint>>,
}
