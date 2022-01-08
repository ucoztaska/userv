import { Command } from '@oclif/command';
import iro, { green, red } from 'node-iro';

import servers from '../lib/servers';
import { Server } from '../types/servers';

import { check } from '../lib/check';

export default class Check extends Command {
  static description =
    'Check if a certain uCoz/Narod/uWeb server is available.';

  static examples = [
    `$ userv check s32
The server s32 (195.216.243.232) from the uCoz family is currently AVAILABLE.`,
    `$ userv check 195.216.243.232
The server s32 (195.216.243.232) from the uCoz family is currently AVAILABLE.`,
  ];

  static args = [{ name: 'server', required: true }];

  getInputType(input: string): string | boolean {
    if (input[0].toLowerCase() === 's' && parseInt(input.slice(1))) {
      return 'name';
    }

    const splitInput = input.split('.');

    if (splitInput.length !== 4) {
      return false;
    }

    for (let i: number = 0; i < splitInput.length; i++) {
      if (!parseInt(splitInput[i])) {
        return false;
      }
    }

    return 'ip';
  }

  async getNameByIp(ip: string): Promise<string | null> {
    const allServers: Server[] = await servers.get();

    const targetServer: Server | undefined = allServers.find(
      (server) => server.ip === ip,
    );

    if (!targetServer) {
      return null;
    }

    return targetServer.name;
  }

  async run() {
    const { args } = this.parse(Check);

    const type: string | boolean = this.getInputType(args.server);

    if (!type) {
      return this.error('You have provided an invalid argument.');
    }

    let checkName: string = args.server;

    if (type === 'ip') {
      const name = await this.getNameByIp(args.server);

      if (!name) {
        return this.error(
          'The specified IP address could not be found in the database.',
        );
      }

      checkName = name;
    }

    const status = await check(checkName);

    if (!status.ok) {
      return this.error(status.message);
    }

    const output: string = status.up
      ? iro(`✔️ ${status.message}`, green)
      : iro(`❌ ${status.message}`, red);

    return this.log(output);
  }
}
