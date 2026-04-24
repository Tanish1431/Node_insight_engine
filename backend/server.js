import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 NodeGraph Insight Engine running on port ${PORT}`);
  console.log(`   POST http://localhost:${PORT}/bfhl\n`);
});
