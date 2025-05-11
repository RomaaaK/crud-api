import 'dotenv/config';
import { WebServer } from './core/WebServer';
import { registerDbRoutes } from './routes/DBRoutes';

const PORT = parseInt(process.env.DB_PORT || '5000');

const db = new WebServer(PORT);

registerDbRoutes(db);

if (require.main === module) {
  db.start('DB');
}

export default db;
