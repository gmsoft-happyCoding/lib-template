import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';
import { WithPathOpts } from './Opts';
import setInterceptor from './setInterceptor';

const instance = axios.create({
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'repeat', allowDots: true });
  },
});

setInterceptor(instance);

type Conf = AxiosRequestConfig & { opts?: Partial<WithPathOpts> };

function createAPI(baseURL?: string) {
  return function api(conf: Conf) {
    // eslint-disable-next-line no-param-reassign
    conf = conf || {};
    return instance({
      url: conf.url,
      baseURL,
      method: conf.method,
      ...conf.opts,
    });
  };
}

function convertRESTAPI(url: string, opts: WithPathOpts): string {
  if (!opts || !opts.path) return url;

  const pathKeys = Object.keys(opts.path);

  pathKeys.forEach(key => {
    const r = new RegExp(`(:${key}|{${key}})`, 'g');
    // eslint-disable-next-line no-param-reassign
    url = url.replace(r, opts.path[key]);
  });

  return url;
}

interface InterceptorHandler<V> {
  (value: V): V | Promise<V>;
}

interface InterceptorErrorHandler {
  (error: any): any;
}

function useRequestInterceptor(
  beforeRequestHandler?: InterceptorHandler<AxiosRequestConfig>,
  errorHandler?: InterceptorErrorHandler
): number {
  return instance.interceptors.request.use(beforeRequestHandler, errorHandler);
}

function useResponseInterceptor(
  successHandler?: InterceptorHandler<AxiosResponse>,
  errorHandler?: InterceptorErrorHandler
): number {
  return instance.interceptors.response.use(successHandler, errorHandler);
}

function ejectRequestInterceptor(interceptorId: number) {
  instance.interceptors.request.eject(interceptorId);
}

function ejectResponseInterceptor(interceptorId: number) {
  instance.interceptors.response.eject(interceptorId);
}

export {
  createAPI,
  convertRESTAPI,
  useRequestInterceptor,
  useResponseInterceptor,
  ejectRequestInterceptor,
  ejectResponseInterceptor,
  instance,
};
