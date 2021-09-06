import { PostNavigationItem } from './PostNavigationItem';
import styles from './postNavigation.module.scss';

interface Post {
  title: string;
  slug: string;
}

interface postNavigationProps {
  previousPost: null | Post;
  nextPost: null | Post;
}

export function PostNavigation({
  previousPost,
  nextPost,
}: postNavigationProps): JSX.Element {
  return (
    <nav className={styles.postNavigation}>
      <ul>
        {previousPost.slug && (
          <li>
            <PostNavigationItem post={previousPost}>
              Post anterior
            </PostNavigationItem>
          </li>
        )}
        {nextPost.slug && (
          <li>
            <PostNavigationItem post={nextPost}>
              Próximo post
            </PostNavigationItem>
          </li>
        )}
      </ul>
    </nav>
  );
}
