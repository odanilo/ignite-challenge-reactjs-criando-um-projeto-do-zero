import { useEffect } from 'react';
import { useRef } from 'react';

export function CommentsSection(): JSX.Element {
  const sectionRef = useRef<HTMLElement>();

  useEffect(() => {
    const sectionContainer = sectionRef.current;
    const shouldLoadComments = sectionContainer.childElementCount === 0;

    if (shouldLoadComments) {
      const script = document.createElement('script');
      const scriptAttributes = [
        { attr: 'src', value: 'https://utteranc.es/client.js' },
        {
          attr: 'repo',
          value: 'odanilo/ignite-challenge-reactjs-criando-um-projeto-do-zero',
        },
        { attr: 'issue-term', value: 'pathname' },
        { attr: 'label', value: 'blogspot-comment' },
        { attr: 'theme', value: 'github-dark' },
        { attr: 'crossorigin', value: 'anonymous' },
        { attr: 'async', value: '' },
      ];

      scriptAttributes.forEach(({ attr, value }) => {
        script.setAttribute(attr, value);
      });

      sectionContainer.appendChild(script);
    }
  }, []);

  return <section ref={sectionRef} />;
}
