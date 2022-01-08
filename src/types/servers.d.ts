export interface Server {
  name: string;
  ip: string;
  family: 'uCoz' | 'Narod' | 'uWeb';
}

export interface CheckerResponse {
  ok: boolean;
  up?: boolean;
  message: string;
}
