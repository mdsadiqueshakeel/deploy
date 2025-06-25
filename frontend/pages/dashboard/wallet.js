import axios from 'axios';
import { useEffect, useState } from "react";
import api from '../../utils/api';
import { fetchProfile } from '../../utils/profileService';

export default function WalletPage() {
  const [userId, setUserId] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [topupWallet, setTopupWallet] = useState(0);
  const [incomeWallet, setIncomeWallet] = useState(0);
  const [shoppingWallet, setShoppingWallet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [topupAmount, setTopupAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [topupStatus, setTopupStatus] = useState(null);
  const [withdrawStatus, setWithdrawStatus] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('userProfileData');
    let foundId = null;

    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed._id) foundId = parsed._id;
      else if (parsed.basicInfo && parsed.basicInfo._id) foundId = parsed.basicInfo._id;
    }

    const fetchIncomeData = async (uid) => {
      try {
        const incomeRes = await axios.get(`http://localhost:5000/api/income/business/${uid}`);
        const incomeData = incomeRes.data;

        setTotalIncome(incomeData.totalIncome || 0);

        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const currentMonthEntry = (incomeData.monthlyStats || []).find(
          (stat) => stat.month === currentMonthKey
        );

        setMonthlyIncome(currentMonthEntry?.income || 0);
      } catch (err) {
        console.error('❌ Error fetching income data:', err);
      }
    };

    const fetchWallet = async (uid) => {
      try {
        const walletRes = await api.get(`/api/wallet/user/${uid}/wallet`);
        const data = walletRes.data;
        setIncomeWallet(data.incomeWallet || 0);
        setTopupWallet(data.topupWallet || 0);
        setShoppingWallet(data.shoppingWallet || 0);
      } catch (err) {
        console.error("❌ Wallet fetch error:", err);
        if (err.response?.status === 401) {
          window.location.href = '/login';
        }
      }
    };

    const init = async (id) => {
      setUserId(id);
      await fetchIncomeData(id);
      await fetchWallet(id);
      setLoading(false);
    };

    if (foundId) {
      init(foundId);
    } else {
      fetchProfile()
        .then((profile) => {
          const id = profile?.basicInfo?._id;
          if (id) init(id);
        })
        .catch((err) => {
          console.error('❌ Failed to fetch profile:', err);
          setLoading(false);
        });
    }
  }, []);

 const handleTopupRequest = async () => {
  if (!topupAmount || isNaN(topupAmount) || Number(topupAmount) <= 0) {
    setTopupStatus("❌ Please enter a valid amount.");
    return;
  }

  try {

    // ✅ Hitting the correct backend route
    const res = await api.post(
      '/api/wallet/user/topup-request',
      {
        amount: Number(topupAmount),
        note: "User top-up request", // Optional note
      },

    );

    setTopupStatus("✅ Top-up request sent successfully!");
    setTopupAmount('');

    // 🔁 Refresh wallet data after success
    if (userId) {
      const walletRes = await api.get(`/api/wallet/user/${userId}/wallet`, {

      });
      const data = walletRes.data;
      setTopupWallet(data.topupWallet || 0);
    }

  } catch (err) {
    console.error("Top-up request error:", err);
    const errorMessage =
      err.response?.data?.message || err.response?.data?.error || err.message;
    setTopupStatus(`❌ Failed to send request: ${errorMessage}`);
  }
};

 const handleWithdrawRequest = async () => {
  if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
    setWithdrawStatus("❌ Please enter a valid amount.");
    return;
  }

  try {


    // ✅ Hitting the correct backend route
    const res = await api.post(
      '/api/wallet/user/withdraw-request',
      {
        amount: Number(withdrawAmount),
        note: "User withdraw request", // Optional note
      },
      
    );

    setWithdrawStatus("✅ Withdraw request sent successfully!");
    setWithdrawAmount('');

    // 🔁 Refresh wallet data after success
    if (userId) {
      const walletRes = await api.get(`/api/wallet/user/${userId}/wallet`, {
      
      });
      const data = walletRes.data;
      setTopupWallet(data.topupWallet || 0);
    }

  } catch (err) {
    console.error("Withdraw request error:", err);
    const errorMessage =
      err.response?.data?.message || err.response?.data?.error || err.message;
    setWithdrawStatus(`❌ Failed to send request: ${errorMessage}`);
  }
};



  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const cardStyle = {
    flex: "1",
    padding: "1.2rem",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    textAlign: "center",
    minWidth: "250px",
    marginBottom: "1rem"
  };

  const formContainerStyle = {
    marginTop: "1rem",
    padding: "1rem",
    borderTop: "1px solid #eee"
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "1.5rem", color: "#0A2463", fontWeight: "bold" }}>
        💼 Wallet Overview
      </h2>

      {/* Income Section */}
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <div style={cardStyle}>
          <h4 style={{ color: "#3A86FF", fontWeight: "600" }}>Total Income</h4>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#3A86FF", marginTop: "0.5rem" }}>
            ₹ {totalIncome.toFixed(2)}
          </p>
        </div>

        <div style={cardStyle}>
          <h4 style={{ color: "#00b894", fontWeight: "600" }}>Monthly Income</h4>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#00b894", marginTop: "0.5rem" }}>
            ₹ {monthlyIncome.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Wallet Section */}
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div style={cardStyle}>
          <h5 style={{ color: "#3A86FF" }}>Income Wallet</h5>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3A86FF" }}>
            ₹ {incomeWallet.toFixed(2)}
          </p>

             <div style={formContainerStyle}>
            <h6 style={{ color: "#0A2463", marginBottom: "1rem" }}>Request withdraw</h6>
            <input
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginBottom: "0.5rem"
              }}
            />
            <button
              onClick={handleWithdrawRequest}
              style={{
                width: "100%",
                background: "#3A86FF",
                color: "#fff",
                padding: "0.5rem",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500"
              }}
              disabled={!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0}
            >
              Request Amount
            </button>
            {withdrawStatus && (
              <p style={{ 
                marginTop: "0.5rem", 
                color: withdrawStatus.includes("❌") ? "#dc3545" : "#28a745",
                fontSize: "0.9rem"
              }}>
                {withdrawStatus}
              </p>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <h5 style={{ color: "#00b894" }}>Top-up Wallet</h5>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#00b894" }}>
            ₹ {topupWallet.toFixed(2)}
          </p>

          {/* Top-up Request Form */}
          <div style={formContainerStyle}>
            <h6 style={{ color: "#0A2463", marginBottom: "1rem" }}>Request Top-up</h6>
            <input
              type="number"
              placeholder="Enter amount"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginBottom: "0.5rem"
              }}
            />
            <button
              onClick={handleTopupRequest}
              style={{
                width: "100%",
                background: "#3A86FF",
                color: "#fff",
                padding: "0.5rem",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500"
              }}
              disabled={!topupAmount || isNaN(topupAmount) || Number(topupAmount) <= 0}
            >
              Request Amount
            </button>
            {topupStatus && (
              <p style={{ 
                marginTop: "0.5rem", 
                color: topupStatus.includes("❌") ? "#dc3545" : "#28a745",
                fontSize: "0.9rem"
              }}>
                {topupStatus}
              </p>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <h5 style={{ color: "#fd7e14" }}>Shopping Wallet</h5>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fd7e14" }}>
            ₹ {shoppingWallet.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}