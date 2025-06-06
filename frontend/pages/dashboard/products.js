// components/Products.js

import { useEffect, useState } from 'react';
// Assuming Products.module.css exists in the same directory as this component
import styles from './Products.module.css'; // Make sure you have this CSS module
import Image from 'next/image';

// Sample product data with Unsplash image URLs
// Assign random coins to each product between 50 and 500
const products = [
  {
    id: 1,
    name: 'Margherita Pizza',
    price: 12.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl2emF8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 2,
    name: 'Burger & Fries',
    price: 9.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww',
  },
  {
    id: 3,
    name: 'Sushi Platter',
    price: 18.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VzaGl8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 4,
    name: 'Caesar Salad',
    price: 8.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FsYWR8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 5,
    name: 'Pasta Carbonara',
    price: 14.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFzdGF8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 6,
    name: 'Chicken Wings',
    price: 10.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMHdpbmdzfGVufDB8fDB8fHww',
  },
  {
    id: 7,
    name: 'Ice Cream Sundae',
    price: 6.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aWNlJTIwY3JlYW18ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 8,
    name: 'Steak Dinner',
    price: 22.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RlYWt8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 9,
    name: 'Avocado Toast',
    price: 7.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZvY2FkbyUyMHRvYXN0fGVufDB8fDB8fHww',
  },
  {
    id: 10,
    name: 'Pancake Stack',
    price: 8.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFuY2FkZXN8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 11,
    name: 'Tacos',
    price: 11.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFjb3N8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 12,
    name: 'Ramen Bowl',
    price: 13.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFtZW58ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 13,
    name: 'Smoothie Bowl',
    price: 7.49,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21vb3RoaWUlMjBib3dsfGVufDB8fDB8fHww',
  },
  {
    id: 14,
    name: 'Chocolate Cake',
    price: 5.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hvY29sYXRlJTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 15,
    name: 'BBQ Ribs',
    price: 16.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmJxJTIwcmRib3dzfGVufDB8fDB8fHww',
  },
  {
    id: 16,
    name: 'Fruit Salad',
    price: 6.49,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJ1aXQlMjBzYWxhZHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 17,
    name: 'Eggs Benedict',
    price: 9.49,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1558945657-484aa38065ec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWdncyUyMGJlbmVkaWN0fGVufDB8fDB8fHww',
  },
  {
    id: 18,
    name: 'Fish & Chips',
    price: 13.49,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlzaCUyMGFuZCUyMGNoaXBzfGVufDB8fDB8fHww',
  },
  {
    id: 19,
    name: 'Croissant',
    price: 3.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3JvaXNzYW50fGVufDB8fDB8fHww',
  },
  {
    id: 20,
    name: 'Mojito',
    price: 7.99,
    coins: Math.floor(Math.random() * 451) + 50,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9qaXRvfGVufDB8fDB8fHww',
  },
];

export default function Products({ searchQuery, coins, onPurchase }) { // Destructure onPurchase
  const [purchaseError, setPurchaseError] = useState('');

  useEffect(() => {
    // Animation effect when component mounts
    const cards = document.querySelectorAll(`.${styles.productCard}`);
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add(styles.fadeInUp);
    });
  }, [searchQuery]); // Re-run animation when searchQuery changes

  const handleBuyNow = (product) => {
    if (coins >= product.coins) {
      onPurchase(product.coins); // Call the onPurchase function passed from Dashboard
      setPurchaseError('');
    } else {
      setPurchaseError(`Not enough points to purchase ${product.name}. You need ${product.coins} coins.`);
      setTimeout(() => setPurchaseError(''), 3000); // Clear error after 3 seconds
    }
  };

  // Filter products based on search query
  // Ensure searchQuery is a string before calling toLowerCase()
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes((searchQuery || '').toLowerCase()) // Added || '' to handle undefined/null searchQuery
  );

  return (
    <div className="container-fluid py-4">
      <h1
        className="mb-5 fw-bold"
        style={{
          color: '#0A2463',
          textShadow: '1px 1px 2px rgba(0, 245, 255, 0.2)',
        }}
      >
        Our Delicious Menu
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
              <div
                className={`card h-100 ${styles.productCard}`}
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
                  style={{ borderRadius: '15px 15px 0 0', height: '200px', width: 'auto', objectFit: 'cover' }}
                  width={500}
                  height={200}
                />
                <div className="card-body d-flex flex-column p-4">
                  <h5
                    className="card-title mb-3"
                    style={{ color: '#0A2463', fontWeight: '600' }}
                  >
                    {product.name}
                  </h5>
                  <div className="d-flex justify-content-between mb-3 align-items-center">
                    <p
                      className="card-text text-muted mb-0"
                      style={{ color: '#0A2463', fontSize: '1.1rem' }}
                    >
                      ${product.price.toFixed(2)}
                    </p>
                    <div className="d-flex align-items-center">
                      <i className="bi-coin me-1" style={{ color: '#FFD700', fontSize: '1.2rem' }}></i>
                      <span className="fw-bold" style={{ color: '#0A2463', fontSize: '1.1rem' }}>{product.coins}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="btn mt-auto"
                    disabled={coins < product.coins} // Disable if not enough coins
                    style={{
                      background: coins >= product.coins
                        ? 'linear-gradient(135deg, #3A86FF 0%, #0A2463 100%)'
                        : '#ccc', // Grey out button if disabled
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '600',
                      letterSpacing: '1px',
                      boxShadow: '0 4px 15px rgba(58, 134, 255, 0.4)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: coins >= product.coins ? 'pointer' : 'not-allowed',
                    }}
                    onMouseEnter={(e) => {
                      if (coins >= product.coins) {
                        e.target.style.boxShadow = '0 6px 20px rgba(58, 134, 255, 0.6)';
                        e.target.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (coins >= product.coins) {
                        e.target.style.boxShadow = '0 4px 15px rgba(58, 134, 255, 0.4)';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <span style={{ position: 'relative', zIndex: '2' }}>
                      {coins >= product.coins ? `Buy Now (${product.coins} coins)` : `Need ${product.coins - coins} more coins`}
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.3) 0%, transparent 100%)',
                        transform: 'rotate(45deg)',
                        transition: 'all 0.5s ease',
                        opacity: '0',
                      }}
                      className="btn-shine"
                    />
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
