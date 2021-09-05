import Link from 'next/link';

import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={commonStyles.container}>
      <div
        className={`${styles.headerContainer} ${commonStyles.articleContainer}`}
      >
        <Link href="/">
          <a>
            <img src="/spacetraveling-logo.svg" alt="logo" />
          </a>
        </Link>
      </div>
    </header>
  );
}
