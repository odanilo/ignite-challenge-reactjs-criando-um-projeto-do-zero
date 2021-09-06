import Link from 'next/link';
import { ReactNode } from 'react';

interface PostNavigationItemProps {
  post: {
    title: string;
    slug: string;
  };
  children: ReactNode;
}

export function PostNavigationItem({
  post,
  children,
}: PostNavigationItemProps): JSX.Element {
  return (
    <Link href={`/post/${post.slug}`}>
      <a>
        <h3>{post.title}</h3>
        <p>{children}</p>
      </a>
    </Link>
  );
}
