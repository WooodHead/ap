export const environment = {
  production: true,
  get socket() {
    return `wss://${this.socketDomain}:8089/ws`;
  },
  get socketDomain() { return  window.location.hostname; },
};
