import Textarea from "@/components/Textarea";
import { db } from "@/services/firebase";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, FormEvent, use, useEffect, useState } from "react";
import { FaShare } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

import styles from "./styles.module.css";

interface DashboardProps {
  user: {
    email: string;
  };
}

interface TaskProps {
  id: string;
  created_at: Date;
  public: boolean;
  task: string;
  user: string;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, settasks] = useState<TaskProps[]>([]);

  useEffect(() => {
    async function loadTasks() {
      const ref = query(
        collection(db, "tasks"),
        orderBy("created_at", "desc"),
        where("user", "==", user?.email)
      );

      onSnapshot(ref, (snapshot) => {
        const list: TaskProps[] = [];

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            task: doc.data().task,
            created_at: doc.data().created_at,
            public: doc.data().public,
            user: doc.data().user,
          });
        });

        settasks(list);
      });
    }
    loadTasks();
  }, [user?.email]);

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
    } catch (error) {
      console.log(error);
    }
  }

  const handleShare = async (id: string) => {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );
  };
  const handleDeleteTask = async (id: string) => {
    const docRef = doc(db, "tasks", id);
    await deleteDoc(docRef);
  };

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

          {tasks.map((item) => (
            <article key={item.id} className={styles.task}>
              {item.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>Public</label>
                  <button
                    className={styles.shareButton}
                    onClick={() => handleShare(item.id)}
                  >
                    <FaShare size={22} color="#3183ff" />
                  </button>
                </div>
              )}

              <div className={styles.taskContent}>
                {item.public ? (
                  <Link href={`/task/${item.id}`}>
                    <p>{item.task}</p>
                  </Link>
                ) : (
                  <p>{item.task}</p>
                )}

                <button
                  className={styles.buttonTrash}
                  onClick={() => handleDeleteTask(item.id)}
                >
                  <FaTrash size={22} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
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
