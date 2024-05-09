import { Opts } from '../Opts';
import instance from './instance';

/**
 * 我们服务器的一些零星 API 的调用
 */
function demo(opts: Opts) {
  return instance({
    method: 'get',
    url: '/demo',
    opts,
  });
}

export { demo };
