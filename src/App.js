import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 15px;
  text-shadow: -2px 2px 3px #000;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-size: 20px;
  font-color: #fff;
  color: var(--secondary-text);
  width: 200px;
  cursor: pointer;
  box-shadow: 0px 6px 5px -2px rgba(0, 0, 0, 0.7);
  -webkit-box-shadow: 0px 6px 5px -2px rgba(0, 0, 0, 0.7);
  -moz-box-shadow: 0px 6px 0px -2px rgba(0, 0, 0, 0.7);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  font-family: 'Bangers', cursive;
`;
export const LinkButton = styled.button`
  justify-content: flex-end;
  padding: 15px;
  text-shadow: -2px 2px 3px #000;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-size: 18px;
  font-color: #fff;
  color: var(--secondary-text);
  width: 100%;
  cursor: pointer;
  box-shadow: 0px 6px 5px -2px rgba(0, 0, 0, 0.7);
  -webkit-box-shadow: 0px 6px 5px -2px rgba(0, 0, 0, 0.7);
  -moz-box-shadow: 0px 6px 0px -2px rgba(0, 0, 0, 0.7);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  font-family: 'Bangers', cursive;
  @media (min-width: 767px) {
    flex-direction: row;
    width: 250px;
    font-size: 20px;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 15px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 24px;
  color: var(--primary-text);
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 6px 5px -2px rgba(0, 0, 0, 0.7);
  -webkit-box-shadow: 0px 6px 5px -2px rgba(0, 0, 0, 0.7);
  -moz-box-shadow: 0px 6px 0px -2px rgba(0, 0, 0, 0.7);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
    
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  paddingTop: 100px;
  @media (min-width: 767px) {
    width: 300px;
  }

  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledSocial = styled.img`
boxShadow: "-5px 10px 11px 5px rgba(0,0,0,0.7)",
  width: 40px;
  height: 40px;
  margin: 10px;
  @media (min-width: 767px) {
    width: 50px;
    height: 50px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: -5px 10px 11px 5px rgba(0, 0, 0, 0.7);
  background-color: var(--accent);
  border-radius: 10%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click MINT And Let's Do This!`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    let totalMintedAmount = String(ownerMintedCount + mintAmount);
    console.log("Minted Amount", totalMintedAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        totalMintedAmount,
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Your ${CONFIG.NFT_NAME} has been minted! go visit PaintSwap to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <a href={CONFIG.MARKETPLACE_LINK}>
          <StyledLogo alt={"logo"} src={"/config/images/logo.png"}/>
        </a>
        <s.TextTitle
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                    <p>TEST NET ONLY. CONTRACT IS NOT YET LIVE.</p>
                    <p>🔥🥷 KungFuu Whitelist Presale Tomorrow 🥷🔥</p>
                    <p>Treasury backed yield bearing NFTs on Fantom</p>
                    </s.TextTitle>
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 10 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/example.gif"} />
          </s.Container>
          <s.SpacerLarge />
          <s.BlurContainer
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              padding: 10,
              borderRadius: 24,
              border: "6px solid var(--secondary)",
              boxShadow: "-5px 10px 11px 5px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextMint
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextMint>
            <span
              style={{
                textAlign: "center",
              }}
            >
            </span>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Cost to mint 1 {CONFIG.SYMBOL} is {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      <p>Mint count will show ZERO if you are not connected.</p>
                      <p>Please connect to the {CONFIG.NETWORK.NAME} network to mint.</p>
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT WALLET
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                  
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextTitle
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                          fontSize:36,
                        }}
                      >
                        {mintAmount}
                      </s.TextTitle>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "MINT MY NFT"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
              
            )}
                    <s.SpacerLarge />
              <s.LinkContainer ai={"center"} jc={"center"} fd={"row"}>
                <span><LinkButton
                style={{
                  marginTop: "50px",
                  margin: "5px",
                }}
                onClick={(e) => {
                  window.open(CONFIG.WHITEPAPER_LINK, "_blank");
                }}
              >
                {CONFIG.WHITEPAPER}
              </LinkButton>
              <LinkButton
                style={{
                  margin: "5px",                
                }}
                onClick={(e) => {
                  window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                }}
              >
                {CONFIG.MARKETPLACE}
              </LinkButton></span></s.LinkContainer>
              <s.TextTitle
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    ><p>🚀 General Public Sale Live 7am UTC June 1st 🚀</p>
                    </s.TextTitle>
            <s.SpacerLarge />
            
          </s.BlurContainer>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/config/images/example.gif"}
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            <p>Please make sure you are connected to {CONFIG.NETWORK.NAME}.</p>
            <p>Please note:
            Once you make the purchase, you cannot undo this action.</p>
          </s.TextDescription>
          <s.SpacerSmall />
        </s.Container><span>
        <a href={CONFIG.TWITTER_LINK}>
          <StyledSocial alt={"logo"} src={"/config/images/twitter.png"}/>
        </a>
        <a href={CONFIG.DISCORD_LINK}>
          <StyledSocial alt={"logo"} src={"/config/images/discord.png"}/>
        </a>
        <a href={CONFIG.TELEGRAM_LINK}>
          <StyledSocial alt={"logo"} src={"/config/images/telegram.png"}/>
        </a>
        </span>
</s.Container>
    </s.Screen>
  );
}

export default App;
