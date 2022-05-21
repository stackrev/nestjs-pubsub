import { Observable } from 'rxjs';

export interface PubSubServiceInterface {
  fromEvent(eventName: string): Observable<any>;
  onEvent(eventName: string): Observable<any>;
  publish(channel: string, value: unknown): Promise<any>;
}
