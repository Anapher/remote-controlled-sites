import { WorkerSettings, Worker } from 'mediasoup/node/lib/types';
import Logger from '../utils/logger';
import * as mediasoup from 'mediasoup';

const logger = new Logger();

/**
 * Simple load balancing of Mediasoup workers
 */
export default class MediaSoupWorkers {
   private workers: Worker[] = [];
   private nextWorkerId = 0;

   async run(numWorkers: number, settings: WorkerSettings): Promise<void> {
      logger.info('Initialize Mediasoup %s, run %d mediasoup Workers...', mediasoup.version, numWorkers);

      for (let i = 0; i < numWorkers; ++i) {
         const worker = await mediasoup.createWorker(settings);

         worker.on('died', () => {
            logger.error('mediasoup worker died, exiting in 2 seconds... [pid:%d]', worker.pid);

            setTimeout(() => process.exit(1), 2000);
         });

         this.workers.push(worker);
      }

      logger.info('Mediasoup workers started (min_port: %d, max_port: %d)', settings.rtcMinPort, settings.rtcMaxPort);
   }

   getNextWorker(): Worker {
      if (this.workers.length === 0) throw new Error('Please execute run() first');

      const worker = this.workers[this.nextWorkerId];
      if (++this.nextWorkerId === this.workers.length) this.nextWorkerId = 0;

      return worker;
   }

   close(): void {
      for (const worker of this.workers) {
         worker.close();
      }

      this.workers = [];
   }
}
