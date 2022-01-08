import axios, { AxiosResponse } from 'axios';

import { Server } from '../types/servers';

const SERVER_LIST: string = 'https://forum.ucoz.ru/tracetcp/lists_ip.html';
const RE_ENTRY = /s([0-9]+).*((([0-9]){1,3}\.){3}([0-9]{1,3}))/g;

function fetchServerListHTML(): Promise<string> {
  return new Promise((resolve, reject) => {
    return axios
      .get(SERVER_LIST)
      .then((res: AxiosResponse) => resolve(res.data))
      .catch(() =>
        reject(
          'Failed to fetch the list of the servers. Are you sure you are connected to the internet?',
        ),
      );
  });
}

function getServerFamily(num: number): 'uCoz' | 'Narod' | 'uWeb' {
  if (num >= 700) {
    return 'uWeb';
  }

  if (num >= 200) {
    return 'Narod';
  }

  return 'uCoz';
}

function getRowData(row: string): Server {
  const split = row.trim().split(' ');

  const name = split[0];
  const ip = split.pop()!;
  const serverNum = parseInt(name.slice(0), 10);
  const family: 'uCoz' | 'Narod' | 'uWeb' = getServerFamily(serverNum);

  return {
    name,
    ip,
    family,
  };
}

async function get(): Promise<Server[]> {
  const servers: Server[] = [];

  const html: string = await fetchServerListHTML();

  const entries: string[] = Array.from(html.match(RE_ENTRY) ?? []);
  entries.forEach((entry) => {
    const row = getRowData(entry);
    servers.push(row);
  });

  return servers;
}

export default {
  get,
};
