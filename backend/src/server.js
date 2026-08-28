const app = require('./app');

const PORT = process.env.BACKEND_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});