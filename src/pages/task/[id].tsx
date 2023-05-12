import Textarea from "@/components/Textarea";
import { db } from "@/services/firebase";
import { async } from "@firebase/util";
import { doesNotMatch } from "assert";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { FaTrash } from "react-icons/fa";

import styles from "./styles.module.css";

interface TaskProps {
  item: {
    id: string;
    created_at: string;
    public: boolean;
    task: string;
    user: string;
  };
  allComments: CommentProps[];
}

interface CommentProps {
  id: string;
  comment: string;
  user: string;
  taskId: string;
  name: string;
}

const Task = ({ item, allComments }: TaskProps) => {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentProps[]>(allComments || []);

  const handleComment = async (event: FormEvent) => {
    event.preventDefault();
    if (input === "") return;

    if (!session?.user?.name || !session?.user?.email) return;

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created_at: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.id,
      });

      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.id,
      };

      setInput("");
      setComments((oldItems) => [...oldItems, data]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const docRef = doc(db, "comments", id);
      await deleteDoc(docRef);
      const deleteComment = comments.filter((item) => item.id !== id);
      setComments(deleteComment);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Details of the task</title>
      </Head>
      <main>
        <h1>Task</h1>
        <article>
          <p>{item.task}</p>
        </article>

        <section className={styles.commentsContainer}>
          <h2>Write a comment</h2>
          <form onSubmit={handleComment}>
            <Textarea
              value={input}
              placeholder="Type your comment"
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                setInput(event.target.value)
              }
            />
            <button disabled={!session?.user} className={styles.button}>
              Send
            </button>
          </form>
        </section>
        <section className="styles.commentsContainer">
          <h2>Todos comentários</h2>
          {comments.length === 0 && <span>Comments not found</span>}
          {comments.map((item) => (
            <article key={item.id} className={styles.comment}>
              <div className={styles.headComment}>
                <label className={styles.commentsLabel}>{item.name}</label>
                {item.user === session?.user?.email && (
                  <button
                    className={styles.buttonTrash}
                    onClick={() => handleDeleteComment(item.id)}
                  >
                    <FaTrash size={18} color="#EA3140" />
                  </button>
                )}
              </div>
              <p>{item.comment}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Task;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const docRef = doc(db, "tasks", id);

  const queryComments = query(
    collection(db, "comments"),
    where("taskId", "==", id)
  );

  const snapshotComments = await getDocs(queryComments);

  const allComments: CommentProps[] = [];
  snapshotComments.forEach((doc) => {
    const miliseconds = doc.data()?.created_at?.seconds * 1000;
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      user: doc.data().user,
      name: doc.data().name,
      taskId: doc.data().taskId,
    });
  });

  const snapshot = await getDoc(docRef);

  if (!snapshot.data() == undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const miliseconds = snapshot.data()?.created_at?.seconds * 1000;

  const task = {
    task: snapshot.data()?.task,
    public: snapshot.data()?.public,
    created_at: new Date(miliseconds).toLocaleDateString("pt-BR"),
    user: snapshot.data()?.user,
    id: id,
  };

  return { props: { item: task, allComments } };
};
