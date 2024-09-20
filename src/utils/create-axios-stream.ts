// https://milkmidi.medium.com/%E6%B7%B1%E5%85%A5%E4%BD%86%E4%B8%8D%E6%B7%BA%E5%87%BA-rxjs-axios-%E8%A3%BD%E4%BD%9C-search-%E5%8A%9F%E8%83%BD-eb7727db47f2

import axios, { AxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';

class ResponseError extends Error {
  constructor(public response: any) {
    super(response.message);
  }
  toString() {
    return JSON.stringify(this.response);
  }
}

export function createAxiosStream<T>(config: AxiosRequestConfig) {
  return new Observable<T>((observer) => {
    const controller = new AbortController();
    axios({
      ...config,
      signal: controller.signal,
    })
      .then((response) => {
        observer.next(response.data as T);
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          // console.log(error.response.data);
          observer.error(new ResponseError(error.response.data));
        }
      })
      .finally(() => {
        observer.complete();
      });
    return () => {
      controller.abort();
    };
  });
}
