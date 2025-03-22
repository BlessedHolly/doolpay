import Avatar from "../../../components/Avatar/Avatar";
import {
  useChangeBalanceMutation,
  useGetProfileQuery,
} from "../../../store/apiAccountSlice";
import styles from "./Account.module.scss";
import { Link } from "react-router-dom";
import card from "/card.png";
import { useState, useRef, FormEvent } from "react";

function Account() {
  const [changeBalance, { data: dataChangeBalance }] =
    useChangeBalanceMutation();
  const { data, isError, refetch } = useGetProfileQuery(
    dataChangeBalance?.balance,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [isFormVisible, setIsFormVisible] = useState(false);
  const cardDiv = useRef<HTMLDivElement>(null);

  const [amount, setAmount] = useState("");

  function handleClick() {
    setIsFormVisible((prev) => !prev);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    changeBalance(parseFloat(e.currentTarget.amount.value));
  }

  return (
    <div>
      <h1>Account</h1>
      <div className={styles.userInformation}>
        <Avatar
          avatar={data.user.avatar}
          classNameAvatar="accountAvatar"
          className={styles.avatar}
          refetch={refetch}
        />
        <div className={styles.details}>
          <h2 className={styles.name}>{data.user.name}</h2>
          <p className={styles.email}>{data.user.email}</p>
          <p className={styles.sum}>${data.user.balance.toFixed(2)}</p>
          <Link to={"edit"} className="normal-button">
            <p className={styles.textLink}>Edit Profile</p>
          </Link>
        </div>
      </div>

      <div
        className={`${styles.card} ${isFormVisible ? styles.moveLeft : ""}`}
        ref={cardDiv}
      >
        <img className={styles.cardImg} src={card} alt="card" />
        <button onClick={handleClick} className={styles.replenish}>
          Replenish
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`${styles.replenishForm} ${
          isFormVisible ? styles.show : styles.hide
        }`}
      >
        <p className={styles.wallet}>Wallet: {data.user.id.slice(0, 10)}</p>
        {isError ? (
          <p className={styles.fallback}>Replenishment error</p>
        ) : null}

        <input
          className={styles.inputReplenish}
          type="text"
          placeholder="Enter amount"
          required
          name="amount"
          value={amount}
          onChange={(e) => {
            if (/^-?\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value);
          }}
        />
        <button className={styles.submitButton} type="submit">
          Confirm
        </button>
      </form>
      <section className={styles.accountActivity}>
        <h2>Recent Activity</h2>
        <ul>
          <li>Purchased "React Mastery Course" - $199</li>
          <li>Subscription Renewal - $29.99</li>
          <li>Refund for "JavaScript Essentials" - $50</li>
        </ul>
      </section>
    </div>
  );
}

export default Account;
