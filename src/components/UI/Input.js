import styles from "./Input.module.css";

export default function Input() {
  return (
    <>
      <label htmlFor="id"></label>
      <input id="email" name="email" type="email" />
      <label htmlFor="password"></label>
      <input id="password" name="password" type="password" />
    </>
  );
}
