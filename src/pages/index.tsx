import { GetStaticProps } from 'next';
import Link from 'next/link';
import { MdOutlineDateRange } from 'react-icons/md';
import { FiUser } from 'react-icons/fi';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
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

export default function Home({ postsPagination }: HomeProps) {
  const { results, next_page } = postsPagination;

  return (
    <main className={styles.container}>
      <header>
        <img src="/images/logo.svg" alt="" />
      </header>
      <div className={styles.posts}>
        {results.map(post => (
          <Link key={post.uid} href={`/posts/${post.uid}`}>
            <a>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <div>
                <time>
                  <MdOutlineDateRange size="20" />
                  <span>{post.first_publication_date}</span>
                </time>
                <p>
                  <FiUser size="20" />
                  <span>{post.data.author}</span>
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
      <footer>
        <a>Carregar mais posts</a>
      </footer>
    </main>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts');

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(
        post.last_publication_date
      ).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = { results, next_page: postsResponse.next_page };

  return {
    props: { postsPagination },
  };
};
