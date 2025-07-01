// pages/dashboard/rank.js

import Head from 'next/head';

export default function RankPage() {
  return (
    <>
      <Head>
        <title>Rank & Rewards - GROWTHAFFINITY</title>
        <meta name="description" content="Your current rank and reward progress" />
      </Head>

      <div
        style={{
          padding: '40px 20px',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(58, 134, 255, 0.1) 0%, rgba(10, 36, 99, 0.1) 90%)',
        }}
      >
        <div className="container text-center">
          <h2 className="fw-bold mb-3" style={{ color: '#1E293B' }}>Rank & Rewards</h2>
          <p style={{ fontSize: '18px' }}>This page is coming soon............!!!!!!!!!!</p>
        </div>
      </div>
    </>
  );
}
