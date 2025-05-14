// components/Loader.tsx
import React from 'react';
import styles from './styles.module.scss';

const Loader: React.FC = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
      <p className={styles.loadingText}>Loading</p>
    </div>
  );
};

export default Loader;
