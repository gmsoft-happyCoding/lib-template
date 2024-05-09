import { notification } from 'antd';
import { AxiosError } from 'axios';

export default (err: AxiosError) =>
  notification.error({
    message: '请求错误!',
    description:
      err?.response?.data?.message || err?.response?.data?.msg || err?.response?.data?.error,
  });
