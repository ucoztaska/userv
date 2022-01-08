import { Command } from '@oclif/core';
import iro, { green, red } from 'node-iro';

import axios, { AxiosResponse } from 'axios';

class ValidationError extends Error {
  constructor(message: string) {
    super();
    this.name = 'ValidationError';
    this.message = message;
  }
}

export default class Site extends Command {
  static description = 'Check what server your website is hosted on.';

  static examples = [
    '$ userv site forum.ucoz.com\n✔️ The site forum.ucoz.com is hosted on s101.',
  ];

  static args = [{ name: 'url', required: true }];

  validateUrl(url: string) {
    url = url.toLowerCase();

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
    }

    if (
      url
        .split('://')[1]
        .split('.')
        .filter(
          (component: string) => component.length && !component.includes('/'),
        ).length < 2
    ) {
      return false;
    }

    return url;
  }

  getServerNumber(serverString: string) {
    const matches = serverString.match(/\(s([0-9]+)\)/g);
    return matches && matches[0] && matches[0].slice(1, -1);
  }

  async run() {
    const { args } = await this.parse(Site);

    const url = this.validateUrl(args.url);

    if (!url) {
      return this.error('Please provide a valid URL.');
    }

    try {
      const html = await axios.get(url).then((res: AxiosResponse) => res.data);

      const matches = html.match(/<!-- [0-9].([0-9]+) \(s([0-9]+)\) -->/g);
      if (!matches) {
        throw new ValidationError('That is not a uCoz website.');
      }

      const server = this.getServerNumber(matches[0]);

      return this.log(
        iro(`✔️ The site ${args.url} is hosted on ${server}.`, green),
      );
    } catch (err) {
      if ((err as any).name === 'ValidationError') {
        return this.error(iro(`❌ ${err}`, red));
      }

      return this.error(iro('❌ The provided website is not available.', red));
    }
  }
}
