export const enviroment = {
  production: false,
  apiUrl: 'http://192.168.0.177',
  restPort: 3000,
  socketPort: 80,
  get restUrl() {
    return `${this.apiUrl}:${this.restPort}`;
  },
  get socketUrl() {
    return `${this.apiUrl}:${this.socketPort}`;
  },
};
