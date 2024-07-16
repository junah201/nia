import { useState } from 'react';

import Description from './Description';
import FAQ from './FAQ';
import Form from './Form';
import MyURLs from './MyURLs';

const Home = () => {
  const [shortUrl, setShortUrl] = useState<string | null>(null);

  return (
    <div className="w-full max-w-5xl space-y-6">
      <Form shortUrl={shortUrl} setShortUrl={setShortUrl} />
      <MyURLs />
      <Description />
      <FAQ />
    </div>
  );
};

export default Home;
