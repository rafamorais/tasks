import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import styles from "./styles.module.css";

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href="/">
            <h1 className={styles.logo}>
              Tasks <span>+</span>
            </h1>
          </Link>

          {session?.user && (
            <Link className={styles.link} href="/dashboard">
              My painel
            </Link>
          )}
        </nav>
        {status === "loading" ? (
          <></>
        ) : session ? (
          <div>
            <button className={styles.loginButton}>
              Hi, {session.user?.name}
            </button>
            <button className={styles.logOutButton} onClick={() => signOut()}>
              Log out
            </button>
          </div>
        ) : (
          <button
            className={styles.loginButton}
            onClick={() => signIn("google")}
          >
            Login
          </button>
        )}
      </section>
    </header>
  );
};

export default Header;
