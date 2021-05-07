import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';

import router from 'next/router';

const Signout = () => {
  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Sign out ...</div>;
};

export default Signout;
