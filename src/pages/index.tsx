import Head from "next/head";
import Image from "next/image";
import heroImg from "@/assets/hero.png";
import style from "@/styles/home.module.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import internal from "stream";
import { GetStaticProps } from "next";

interface HomeProps {
  tasks: number;
  comments: number;
}

export default function Home({ tasks, comments }: HomeProps) {
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
            <span>+{tasks} posts</span>
          </section>
          <section className={style.box}>
            <span>+{comments} comments</span>
          </section>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const commentRef = collection(db, "comments");
  const taskRef = collection(db, "tasks");

  const commentSnapshot = await getDocs(commentRef);
  const taskSnapshot = await getDocs(taskRef);

  return {
    props: {
      tasks: taskSnapshot.size || 0,
      comments: taskSnapshot.size || 0,
    },
    revalidate: 60,
  };
};
