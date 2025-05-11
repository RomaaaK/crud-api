import 'dotenv/config';
import cluster from 'cluster';
import os from 'os';
import server from './main';
import { LoadBalancer } from './proxy/LoadBalancer';
import db from './db';

const PORT = parseInt(process.env.PORT || '3000');
const numCPUs = os.cpus().length - 1;
const workerPorts: number[] = [];

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    const workerPort = PORT + i + 1;
    workerPorts.push(workerPort);
    cluster.fork({ PORT: workerPort.toString() });
  }

  const lb = new LoadBalancer({ port: PORT, targets: workerPorts });
  lb.start();

  db.start('DB');

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });

  process.on('SIGINT', () => {
    console.log('\nGraceful shutdown started...');

    lb.stop();

    db.stop(() => {
      console.log('Database stopped.');

      for (const id in cluster.workers) {
        const worker = cluster.workers[id];
        if (worker) {
          worker.kill();
        }
      }

      console.log('All workers killed.');
      process.exit(0);
    });
  });
} else {
  server.start('Web');
}
