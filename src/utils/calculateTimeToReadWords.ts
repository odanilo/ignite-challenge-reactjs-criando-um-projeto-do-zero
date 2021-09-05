import { RichText } from 'prismic-dom';

interface Content {
  heading: string;
  body: {
    text: string;
  }[];
}

function countWordsInText(text: string): number {
  return text.split(' ').length;
}

export function calculateTimeToReadWords(content: Content[]): number {
  const averageWordsReadPerMinute = 200;
  const wordCount = content.reduce((acc, { body, heading }) => {
    const headingWordCount = heading ? countWordsInText(heading) : 0;
    const bodyWordCount = countWordsInText(RichText.asText(body));

    return acc + headingWordCount + bodyWordCount;
  }, 0);

  const minutesToReadWordsInText = Math.ceil(
    wordCount / averageWordsReadPerMinute
  );

  return minutesToReadWordsInText;
}
