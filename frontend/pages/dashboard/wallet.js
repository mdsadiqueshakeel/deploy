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
    // Debug: Check what's actually in localStorage
    console.log("Current localStorage token:", localStorage.getItem("token"));
    console.log("Current localStorage contents:", localStorage);

    const walletRes = await api.get(`/api/wallet/user/${uid}/wallet`);
    
    console.log("Wallet API response:", walletRes); // Debug the response
    
    const data = walletRes.data;
    setIncomeWallet(data.incomeWallet || 0);
    setTopupWallet(data.topupWallet || 0);
    setShoppingWallet(data.shoppingWallet || 0);
    
  } catch (err) {
    console.error("Full error object:", err);
    if (err.response) {
      console.error("Error response data:", err.response.data);
      console.error("Error status:", err.response.status);
      console.error("Error headers:", err.response.headers);
    }
    // Optional: Redirect to login if unauthorized
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
    minWidth: "200px"
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
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2d3436", marginTop: "0.5rem" }}>
            ₹ {totalIncome.toFixed(2)}
          </p>
        </div>

        <div style={cardStyle}>
          <h4 style={{ color: "#00b894", fontWeight: "600" }}>Monthly Income</h4>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2d3436", marginTop: "0.5rem" }}>
            ₹ {monthlyIncome.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Wallet Section */}
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div style={cardStyle}>
          <h5 style={{ color: "#3A86FF" }}>Income Wallet</h5>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2d3436" }}>
            ₹ {incomeWallet.toFixed(2)}
          </p>
        </div>

        <div style={cardStyle}>
          <h5 style={{ color: "#00b894" }}>Top-up Wallet</h5>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2d3436" }}>
            ₹ {topupWallet.toFixed(2)}
          </p>
        </div>

        <div style={cardStyle}>
          <h5 style={{ color: "#fd7e14" }}>Shopping Wallet</h5>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2d3436" }}>
            ₹ {shoppingWallet.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
