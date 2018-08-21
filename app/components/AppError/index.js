import React from 'react';
import styles from './style.scss';

const AppError = () => (
  <div className={styles.errorScreen}>
    <div className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>Sorry, something went wrong.</h1>
      <p>We&#39;re working on it and we&#39;ll get it fixed as soon as we can.</p>
    </div>
  </div>
);

export default AppError;
