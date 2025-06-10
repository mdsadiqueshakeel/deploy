// components/Products.js

import { useEffect, useState } from 'react';
import styles from './Products.module.css';
import Image from 'next/image';

const products = [
  {
    id: 1,
    productCode: 1025,
    name: 'Neem Extract',
    dp: 350,
    mrp: 500,
    image: '/assets/images/i1.png',
  },
  {
    id: 2,
    productCode: 8014,
    name: 'Mix Multi Berries Capsules',
    dp: 520,
    mrp: 700,
    image: '/assets/images/i2.png',
  },
  {
    id: 3,
    productCode: 1103,
    name: 'Tropica Multifruits Face Wash',
    dp: 160,
    mrp: 250,
    image: '/assets/images/i3.jpg',
  },
  {
    id: 4,
    productCode: 2065,
    name: 'Coconut & Aloe-Vera Hair Oil',
    dp: 280,
    mrp: 350,
    image: '/assets/images/i4.jpg',
  },
  {
    id: 5,
    productCode: 1145,
    name: 'Onion & Blackseed Shampoo',
    dp: 300,
    mrp: 400,
    image: '/assets/images/i5.jpg',
  },
  {
    id: 6,
    productCode: 1001,
    name: 'Aloe-Vera Extract',
    dp: 350,
    mrp: 500,
    image: '/assets/images/i6.jpg',
  },
];

export default function Products({ searchQuery, coins, onPurchase }) {
  const [purchaseError, setPurchaseError] = useState('');

  useEffect(() => {
    const cards = document.querySelectorAll(`.${styles.productCard}`);
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add(styles.fadeInUp);
    });
  }, [searchQuery]);

  const handleBuyNow = (product) => {
    if (coins >= product.dp) {
      onPurchase(product.dp);
      setPurchaseError('');
    } else {
      setPurchaseError(`Not enough points to purchase ${product.name}. You need ${product.dp} coins.`);
      setTimeout(() => setPurchaseError(''), 3000);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-5 fw-bold" style={{ color: '#0A2463', textShadow: '1px 1px 2px rgba(0, 245, 255, 0.2)' }}>
        Our Product Collection 🧴✨
      </h1>

      {purchaseError && (
        <div className="alert alert-danger position-fixed top-0 start-50 translate-middle mt-3"
          style={{ zIndex: 2000, minWidth: '300px' }}>
          {purchaseError}
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className={`card h-100 ${styles.productCard}`}
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '2px solid #E0E0E0',
                  borderRadius: '15px',
                  boxShadow: '0 10px 25px rgba(58, 134, 255, 0.2)',
                }}
              >
                <Image
                  src={product.image}
                  className={`card-img-top ${styles.productImage}`}
                  alt={product.name}
                  style={{ borderRadius: '15px 15px 0 0', height: '200px', objectFit: 'cover' }}
                  width={500}
                  height={200}
                />
                <div className="card-body d-flex flex-column p-4">
                  <h5 className="card-title mb-2" style={{ color: '#0A2463', fontWeight: '600' }}>
                    {product.name}
                  </h5>
                  <p className="mb-1 text-muted" style={{ fontSize: '0.9rem' }}>
                    <strong>Product Code:</strong> {product.productCode}
                  </p>
                  <p className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                    <strong>MRP:</strong> ₹{product.mrp} / <strong>DP:</strong> ₹{product.dp}
                  </p>

                  <button
                    onClick={() => handleBuyNow(product)}
                    className="btn mt-auto"
                    disabled={coins < product.dp}
                    style={{
                      background: coins >= product.dp
                        ? 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)'
                        : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '600',
                      letterSpacing: '1px',
                      boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: coins >= product.dp ? 'pointer' : 'not-allowed',
                    }}
                    onMouseEnter={(e) => {
                      if (coins >= product.dp) {
                        e.target.style.boxShadow = '0 6px 20px rgba(58, 134, 255, 0.6)';
                        e.target.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (coins >= product.dp) {
                        e.target.style.boxShadow = '0 4px 15px rgba(58, 134, 255, 0.4)';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <span style={{ position: 'relative', zIndex: '2' }}>
                      {coins >= product.dp
                        ? `Buy Now (₹${product.dp})`
                        : `Need ₹${product.dp - coins} more`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p style={{ color: '#0A2463', fontSize: '1.1rem' }}>
            No products found matching &quot;{searchQuery}&quot;.
          </p>
        </div>
      )}
    </div>
  );
}
