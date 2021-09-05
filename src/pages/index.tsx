import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import { formatDate } from '../utils/formatDate';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination: { next_page, results },
}: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(results);
  const [nextPage, setNextPage] = useState<string | null>(next_page);

  async function handleLoadMore(): Promise<void> {
    fetch(nextPage)
      .then(response => response.json())
      .then(data => {
        setPosts(prevState => [...prevState, ...data.results]);
        setNextPage(data.next_page);
      });
  }

  return (
    <>
      <Head>
        <title>Posts | spacetraveling</title>
      </Head>

      <div className={styles.homeContainer}>
        <header>
          <img src="/spacetraveling-logo.svg" alt="logo" />
        </header>

        <main>
          <ul className={styles.articles}>
            {posts.map(post => (
              <li key={post.uid}>
                <article>
                  <Link href={`/post/${post.uid}`}>
                    <a>
                      <h2>{post.data.title}</h2>
                      <h3>{post.data.subtitle}</h3>
                      <footer>
                        <time>
                          <FiCalendar className={commonStyles.icon} />
                          <span>{formatDate(post.first_publication_date)}</span>
                        </time>
                        <div>
                          <FiUser className={commonStyles.icon} />
                          <span>{post.data.author}</span>
                        </div>
                      </footer>
                    </a>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
          {nextPage && (
            <button
              className={commonStyles.simpleButton}
              onClick={handleLoadMore}
              type="button"
            >
              Carregar mais posts
            </button>
          )}
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      orderings: '[document.first_publication_date desc]',
      pageSize: 3,
    }
  );

  const postsFormatted = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: postsFormatted,
      },
    },
  };
};
