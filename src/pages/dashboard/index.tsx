import Textarea from "@/components/Textarea";
import { db } from "@/services/firebase";
import { addDoc, collection } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import Head from "next/head";
import { ChangeEvent, FormEvent, use, useState } from "react";
import { FaShare } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

import styles from "./styles.module.css";

interface DashboardProps {
  user: {
    email: string;
  };
}

const Dashboard = ({ user }: DashboardProps) => {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);

  function handleChangePublicTask(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }

  function handleChangeInput(event: ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value);
  }

  async function handleRegisterTask(event: FormEvent) {
    event.preventDefault();

    if (input === "") {
      return;
    }
    try {
      await addDoc(collection(db, "tasks"), {
        task: input,
        created_at: new Date(),
        user: user.email,
        public: publicTask,
      });

      setInput("");
      setPublicTask(false);
    } catch (error) {}
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>My tasks painel</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>What is your task?</h1>

            <form onSubmit={handleRegisterTask}>
              <Textarea
                placeholder="type your task..."
                value={input}
                onChange={(event) => {
                  handleChangeInput(event);
                }}
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  checked={publicTask}
                  className={styles.checkbox}
                  onChange={(event) => {
                    handleChangePublicTask(event);
                  }}
                />
                <label>Let task public?</label>
              </div>
              <button type="submit" className={styles.button}>
                Register
              </button>
            </form>
          </div>
        </section>
        <section className={styles.taskContainer}>
          <h1>My tasks</h1>

          <article className={styles.task}>
            <div className={styles.tagContainer}>
              <label className={styles.tag}>Public</label>
              <button className={styles.shareButton}>
                <FaShare size={22} color="#3183ff" />
              </button>
            </div>
            <div className={styles.taskContent}>
              <p>Lorem ipsum dolor sit amet</p>
              <button className={styles.buttonTrash}>
                <FaTrash size={22} color="#ea3140" />
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (req) => {
  const session = await getSession(req);
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { user: { email: session.user.email } } };
};
