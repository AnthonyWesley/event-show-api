export interface ISocketServer {
  // io: unknown;

  emit(eventName: string, payload: any): void;

  // on(event: string, callback: (...args: any[]) => void): void;
  // broadcast?(event: string, ...args: any[]): void;
}
