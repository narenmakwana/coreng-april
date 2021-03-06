import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs';

export class BaseService {
  private _headers: Headers = new Headers({'Content-Type' : 'application/json'});
  private _getOptions: RequestOptions = new RequestOptions({headers : this.getHeaders(), body: ''});
  private _postOptions: RequestOptions = new RequestOptions({headers : this.getHeaders()});

  constructor(protected _http: Http) { }

  getHeaders(): Headers {
    return this._headers;
  }

  get(url: string): Observable<Response> {
    let response: Observable<Response> = this._http.get(url, this._getOptions);
    return response.catch(error => {
      let body: any = error.json();
      console.dir(body);
      return response;
    });
  }

  post(url: string, data?: any): Observable<Response> {
    data = data || {};
    let response: Observable<Response> = this._http.post(url, JSON.stringify(data), this._postOptions);
    return response.catch(error => {
      let body: any = error.json();
      console.dir(body);
      return error;
    });
  }
}
