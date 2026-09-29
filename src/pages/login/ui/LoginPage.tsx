import { LoginForm } from '@/features/auth/login';
import styles from './LoginPage.module.css';

export function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo} aria-hidden>
          💬
        </div>
        <h1 className={styles.title}>Веб-чат MAX</h1>
        <p className={styles.subtitle}>
          Введите параметры инстанса из{' '}
          <a href="https://console.green-api.com" target="_blank" rel="noreferrer">
            личного кабинета GREEN-API
          </a>
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
