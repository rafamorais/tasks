import Head from "next/head";
import Image from "next/image";

import heroImg from "@/assets/hero.png";

import style from "@/styles/home.module.css";

export default function Home() {
  return (
    <div className={style.container}>
      <Head>
        <title>Tasks | Organize your tasks in the ease way!</title>
      </Head>
      <main className={style.main}>
        <div className={style.logoContent}>
          <Image
            className={style.hero}
            alt="task logo"
            src={heroImg}
            priority
          />
        </div>
        <h1 className={style.title}>
          System made for you organize <br />
          your study and tasks
        </h1>

        <div className={style.infoContent}>
          <section className={style.box}>
            <span>+12 posts</span>
          </section>
          <section className={style.box}>
            <span>+90 comments</span>
          </section>
        </div>
      </main>
    </div>
  );
}
