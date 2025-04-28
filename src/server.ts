import app from './app';
import { syncDb } from './config/database';

const PORT = 3000;

async function start() {
    try {
      await syncDb();
      console.log('✅ Database synced');
      app.listen(PORT, () =>
        console.log(`🚀 Server running at http://localhost:${PORT}`)
      );
    } catch (err) {
      console.error('❌ Startup failed:', err);
      process.exit(1);
    }
}

start();

