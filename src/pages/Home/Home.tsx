import { Link, useSearchParams } from "react-router-dom";
import styles from "./Home.module.scss";
import { useSelector } from "react-redux";
import { TStore } from "../../store/store";
import { useGetCoinsQuery } from "../../store/apiCoinsSlice";

interface ICoin {
  base: string;
  price: number;
  price_usd: number;
  quote: string;
  time: number;
  volume: number;
}

export default function Home() {
  const { data, isLoading, isError } = useGetCoinsQuery(undefined, {
    pollingInterval: 30000,
  });
  const coins: ICoin[] = (data as { pairs: ICoin[] })?.pairs || [];

  const theme = useSelector((state: TStore) => state.theme.theme);

  const [searchParams, setSearchParams] = useSearchParams({
    filter: "",
    expensive: "off",
  });
  const filter = searchParams.get("filter");
  const expensive = searchParams.get("expensive");

  return (
    <main>
      <h1>Live Cryptocurrency Prices</h1>
      <div className={styles["field-container"]}>
        <label className={styles["text-input"]} htmlFor="name">
          Filter
        </label>
        <input
          name="filter"
          className={`${styles["field"]} ${
            theme === "light" ? styles["field-light"] : null
          }`}
          id="name"
          type="text"
          placeholder=""
          required
          value={filter || ""}
          onChange={(e) =>
            setSearchParams({
              filter: e.target.value,
              expensive: expensive ? expensive : "off",
            })
          }
        />
      </div>

      <div className={styles["checkbox-wrapper"]}>
        <label>
          <input
            onChange={(e) =>
              setSearchParams({
                expensive: e.target.checked ? "on" : "off",
                filter: filter || "",
              })
            }
            type="checkbox"
            className={styles["hidden-checkbox"]}
            checked={expensive === "on" ? true : false}
          />
          <span className={styles["custom-checkbox"]}></span>
          <span className={styles["textLabel"]}>Top 20 expensive</span>
        </label>
      </div>

      <div className={styles["table-container"]}>
        <div
          className={`${styles["table-header"]} ${
            theme === "light" ? styles["table-header-light"] : null
          }`}
        >
          <span>#</span>
          <span>Base</span>
          <span>Price</span>
          <span>Price USD</span>
          <span>Quote</span>
          <span>Time</span>
          <span>Volume</span>
        </div>

        {isLoading ? <p className={styles["spinner"]}>Loading...</p> : null}
        {isError ? <p className={styles["spinner"]}>Failed to load</p> : null}

        <div className={styles["table-body"]}>
          {coins
            ?.filter((coin: ICoin) =>
              coin.base
                .toLowerCase()
                .includes(filter ? filter.toLowerCase() : "")
            )
            .sort((a, b) => {
              if (expensive === "on") {
                return a.price - b.price;
              } else {
                return 0;
              }
            })
            .slice(expensive === "on" ? -20 : 0)
            .reverse()
            .map((coin: ICoin, index: number) => (
              <div
                className={`${styles["table-row"]} ${
                  theme === "light" ? styles["table-row-light"] : null
                }`}
                key={index}
              >
                <span>{index + 1}.</span>
                <span>
                  <Link
                    className={`${styles.linkCoin} ${
                      theme === "light" ? styles["linkCoin-light"] : null
                    }`}
                    to={coin.base}
                  >
                    {coin.base}
                  </Link>
                </span>
                <span>{coin.price.toFixed(3)}</span>
                <span>{coin.price_usd.toFixed(3)}</span>
                <span>{coin.quote ? coin.quote : "N/A"}</span>
                <span>{coin.time}</span>
                <span>{coin.volume}</span>
              </div>
            ))}
        </div>
      </div>
      <div
        className={`${styles.info} ${
          theme === "light" ? styles["info-light"] : null
        }`}
      >
        <div>
          <strong>ZEN</strong> — ZenCash (ZEN) is a privacy-focused
          cryptocurrency and a platform for secure communications and
          transactions.
        </div>
        <div>
          <strong>GALA</strong> — Gala Games (GALA) is a blockchain gaming
          platform that allows players to earn cryptocurrency through gameplay.
        </div>
        <div>
          <strong>CHZ</strong> — Chiliz (CHZ) is a digital currency for sports
          and entertainment platforms, enabling fan engagement through
          tokenization.
        </div>
        <div>
          <strong>SANTOS</strong> — Santos FC Fan Token (SANTOS) is a fan token
          that allows supporters of the Santos FC football club to participate
          in club decisions and access exclusive rewards.
        </div>
        <div>
          <strong>PEPE</strong> — PepeCoin (PEPE) is a meme-inspired
          cryptocurrency featuring the popular internet meme character, Pepe the
          Frog.
        </div>
        <div>
          <strong>LDO</strong> — Lido DAO Token (LDO) is the governance token
          for Lido, a liquid staking solution for Ethereum and other
          proof-of-stake blockchains.
        </div>
        <div>
          <strong>SUPER</strong> — SuperFarm (SUPER) is a cross-chain DeFi
          protocol and NFT platform that allows users to create, farm, and trade
          NFTs.
        </div>
        <div>
          <strong>IOST</strong> — IOST (Internet of Services Token) is a
          decentralized blockchain network focused on providing high transaction
          throughput and scalability.
        </div>
        <div>
          <strong>TON</strong> — Toncoin (TON) is a decentralized layer-1
          blockchain designed by Telegram to handle millions of transactions per
          second.
        </div>
        <div>
          <strong>AVAX</strong> — Avalanche (AVAX) is a high-performance,
          scalable, customizable, and secure blockchain platform for
          decentralized applications and enterprise blockchain deployments.
        </div>
        <div>
          <strong>ETH</strong> — Ethereum (ETH) is a decentralized platform that
          enables developers to build and deploy smart contracts and
          decentralized applications (dApps).
        </div>
        <div>
          <strong>BTC</strong> — Bitcoin (BTC) is the first decentralized
          digital currency, enabling peer-to-peer transactions without the need
          for intermediaries.
        </div>
        <div>
          <strong>DOGE</strong> — Dogecoin (DOGE) is a cryptocurrency featuring
          the likeness of the Shiba Inu dog from the "Doge" meme, initially
          created as a joke but now with a large community.
        </div>
        <div>
          <strong>USDC</strong> — USD Coin (USDC) is a stablecoin pegged to the
          US dollar, providing a digital alternative to traditional fiat
          currencies.
        </div>
      </div>
    </main>
  );
}
