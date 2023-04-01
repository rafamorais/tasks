import { validateHeaderValue } from "http";
import React, { ChangeEvent } from "react";

import styles from "./styles.module.css";

interface TextareaOptionsDTO {
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea = ({ placeholder, value, onChange }: TextareaOptionsDTO) => {
  return (
    <textarea
      className={styles.textarea}
      placeholder={placeholder}
      rows={8}
      value={value}
      onChange={onChange}
    ></textarea>
  );
};

export default Textarea;
