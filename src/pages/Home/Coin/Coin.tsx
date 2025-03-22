import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./Coin.module.scss";
import { useGetCoinsQuery } from "../../../store/apiCoinsSlice";

interface PriceData {
  time: number;
  price: number;
}

interface Trade {
  id: string;
  price: string;
  amount: string;
  type: "Buy" | "Sell";
}

function generateRandomData(): PriceData[] {
  return Array.from({ length: 10 }, (_, index) => ({
    time: index,
    price: Math.random() * 100 + 50,
  }));
}

function generateRandomTrade(): Trade {
  return {
    id: Math.random().toString(36).substr(2, 9),
    price: (Math.random() * 100 + 50).toFixed(2),
    amount: (Math.random() * 5 + 1).toFixed(3),
    type: Math.random() > 0.5 ? "Buy" : "Sell",
  };
}

function Coin() {
  const params = useParams();
  const [data, setData] = useState<PriceData[]>(generateRandomData());
  const [trades, setTrades] = useState<Trade[]>([]);
  const coins = useGetCoinsQuery(undefined);
  // console.log(coins.data?.pairs);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => [
        ...prevData.slice(1),
        { time: prevData.length, price: Math.random() * 100 + 50 },
      ]);
      setTrades((prevTrades) => [
        generateRandomTrade(),
        ...prevTrades.slice(0, 8),
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h1>{params.coin} Price Chart</h1>
      <ResponsiveContainer width="80%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={false} />
          <YAxis domain={[50, 150]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <h2>Recent Trades</h2>
      <div className={styles.tradeTableContainer}>
        <table className={styles.tradeTable}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.id}
                className={trade.type === "Buy" ? styles.buy : styles.sell}
              >
                <td>{trade.type}</td>
                <td>${trade.price}</td>
                <td>{trade.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Coin;
