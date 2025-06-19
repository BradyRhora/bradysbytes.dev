import styles from "@/app/styles/semiComponents.module.css"

export default function DropdownBox({children}: {children: React.ReactNode;}) {
  return (
    <div className={styles.dropdownBox}>
      {children}
    </div>
  );
}