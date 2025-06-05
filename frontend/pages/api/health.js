// Health check endpoint for Railway.app and other monitoring services
export default function handler(req, res) {
  res.status(200).json({ status: 'ok', service: 'frontend' });
}