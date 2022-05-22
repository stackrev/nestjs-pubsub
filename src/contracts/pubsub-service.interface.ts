import { Observable } from 'rxjs';

export interface PubSubServiceInterface {
  onEvent<T>(arg: any): Observable<any> | Promise<any> | T;
  publish<T>(channel: any, value: unknown): Promise<any> | T;
}
