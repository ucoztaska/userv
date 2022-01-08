import { Command } from '@oclif/command';
import iro, { green, red } from 'node-iro';

import servers from '../lib/servers';
import { Server } from '../types/servers';

import { isItUp } from '../lib/check';

export default class All extends Command {
  static description = 'Get a list of all the servers and their status.';

  async forEachAsync(
    arr: any[],
    cb: (predicate: any, idx: number, arr: any[]) => any,
  ) {
    for (let i = 0; i < arr.length; i++) {
      await cb(arr[i], i, arr);
    }
  }

  async run() {
    const allServers: Server[] = await servers.get();

    this.forEachAsync(allServers, async function (server) {
      const url: string = `http://${server.name}.ucoz.net/favicon.ico`;
      const status: boolean = await isItUp(url);

      const output = status
        ? iro(`✔️ ${server.name} (${server.family}/${server.ip}): OK`, green)
        : iro(`❌ ${server.name} (${server.family}/${server.ip}): DOWN`, red);

      return console.log(output);
    });
  }
}
