import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';

import { Server } from '../types/servers';

const SERVER_LIST: string = 'https://forum.ucoz.ru/tracetcp/lists_ip.html';

function fetchServerListHTML(): Promise<string> {
  return new Promise((resolve, reject) => {
    return axios
      .get(SERVER_LIST)
      .then((res: AxiosResponse) => resolve(res.data))
      .catch(() => reject('Failed to fetch the list of the servers. Are you sure you are connected to the internet?'));
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
  const split: string[] = row.split(' &#x2014; ');
  const serverNum: number = parseInt(split[0].slice(1), 10);

  const name: string = split[0];
  const ip: string = split[1];
  const family: 'uCoz' | 'Narod' | 'uWeb' = getServerFamily(serverNum);

  return {
    name,
    ip,
    family
  };
}

async function get(): Promise<Server[]> {
  const servers: Server[] = [];

  try {
    const html: string = await fetchServerListHTML();
    const $: CheerioStatic = cheerio.load(html);

    const rows: Cheerio = $('td > font');

    rows.each((idx: number, row: CheerioElement) => {
      const rowData: string = $(row).html() || '';

      if (!rowData.trim().length) {
        return;
      }

      servers.push(getRowData(rowData.trim()));
    });

    return servers;
  } catch (err) {
    return err;
  }
}

export default {
  get
};
