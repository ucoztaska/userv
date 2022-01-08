import axios from 'axios';
import servers from './servers';

import { Server, CheckerResponse } from '../types/servers';

function isItUp(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    return axios
      .get(url)
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });
}

async function check(name: string): Promise<CheckerResponse> {
  try {
    const allServers: Server[] = await servers.get();

    const targetServer: Server | undefined = allServers.find(
      (server) => server.name === name,
    );

    if (!targetServer) {
      return {
        ok: false,
        message: 'The specified server could not be found in the database.',
      };
    }

    const status: boolean = await isItUp(
      `http://${targetServer.name}.ucoz.net/favicon.ico`,
    );
    const statusText: string = status ? 'AVAILABLE' : 'DOWN';

    return {
      ok: true,
      up: status,
      message: `The server ${targetServer.name} (${targetServer.ip}) from the ${targetServer.family} family is currently ${statusText}.`,
    };
  } catch (err) {
    return {
      ok: false,
      message: `${err}`,
    };
  }
}

export { check, isItUp };
