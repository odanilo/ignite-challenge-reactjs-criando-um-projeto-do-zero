import Head from 'next/head';
import Prismic from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';
import { formatDate } from '../../utils/formatDate';
import { calculateTimeToReadWords } from '../../utils/calculateTimeToReadWords';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { PreviewButton } from '../../components/PreviewButton';
import { CommentsSection } from '../../components/CommentsSection';
import { PostNavigation } from '../../components/PostNavigation';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface NavigationalPost {
  title: null | string;
  slug: null | string;
}

interface PostProps {
  post: Post;
  preview: boolean;
  previousPostData: NavigationalPost;
  nextPostData: NavigationalPost;
}

export default function Post({
  post,
  preview,
  previousPostData,
  nextPostData,
}: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  const contentAsHtml = post.data.content.reduce((acc, { body, heading }) => {
    const headingHtml = heading ? `<h2>${heading}</h2>` : '';
    const bodyHtml = RichText.asHtml(body);
    return acc + headingHtml + bodyHtml;
  }, '');

  const minutesToReadPost = calculateTimeToReadWords(post.data.content);

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>

      <Header />

      <article className={styles.article}>
        <figure>
          <img
            src={post.data.banner.url}
            alt={`Imagem do post ${post.data.title}`}
          />
        </figure>
        <div className={commonStyles.container}>
          <header>
            <div className={commonStyles.articleContainer}>
              <h1>{post.data.title}</h1>
              <footer>
                <time>
                  <FiCalendar className={commonStyles.icon} />
                  <span>{formatDate(post.first_publication_date)}</span>
                </time>
                <div>
                  <FiUser className={commonStyles.icon} />
                  <span>{post.data.author}</span>
                </div>
                <div>
                  <FiClock className={commonStyles.icon} />
                  <span>{minutesToReadPost} min</span>
                </div>
              </footer>
            </div>
          </header>
          <main
            className={`${commonStyles.articleContainer} ${styles.bodyContent}`}
            dangerouslySetInnerHTML={{ __html: contentAsHtml }}
          />

          <div
            className={`${commonStyles.articleContainer} ${styles.postsNavigation}`}
          >
            <PostNavigation
              nextPost={nextPostData}
              previousPost={previousPostData}
            />
          </div>

          <div
            className={`${commonStyles.articleContainer} ${styles.comments}`}
          >
            <CommentsSection />
          </div>

          {preview && (
            <aside
              className={`${commonStyles.articleContainer} ${styles.previewButtonContainer}`}
            >
              <PreviewButton />
            </aside>
          )}
        </div>
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts')
  );

  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const slug = String(params.slug);
  const response = await prismic.getByUID('posts', slug, {
    ref: previewData?.ref ?? null,
  });

  const previousPost = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      fetch: ['posts.title'],
      orderings: '[document.first_publication_date desc]',
      pageSize: 1,
      after: response.id,
    }
  );

  const previousPostData = {
    type: 'previous',
    title:
      previousPost.results_size > 0 ? previousPost.results[0].data.title : null,
    slug: previousPost.results_size > 0 ? previousPost.results[0].uid : null,
  };

  const nextPost = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      fetch: ['posts.title'],
      orderings: '[document.first_publication_date]',
      pageSize: 1,
      after: response.id,
    }
  );

  const nextPostData = {
    title: nextPost.results_size > 0 ? nextPost.results[0].data.title : null,
    slug: nextPost.results_size > 0 ? nextPost.results[0].uid : null,
  };

  const postData = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post: postData,
      preview,
      previousPostData,
      nextPostData,
    },
    revalidate: 60 * 60 * 24, // 1 dia
  };
};
