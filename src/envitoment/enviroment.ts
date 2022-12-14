export const enviroment = {
  production: false,
  apiUrl: 'http://localhost',
  restPort: 3000,
  socketPort: 80,
  get restUrl() {
    return `${this.apiUrl}:${this.restPort}`;
  },
  get socketUrl() {
    return `${this.apiUrl}:${this.socketPort}`;
  },
};
