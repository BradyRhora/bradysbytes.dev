import styles from "@/app/styles/semiComponents.module.css"
import { useState } from "react";

export default function DropdownBox({children}: {children: React.ReactNode}) {
  const []
  const [isOpen, setIsOpen] = useState(false);

  function dropdownClickHandler(e: React.MouseEvent) {
    e.stopPropagation();
    setIsOpen(!isOpen);
  }

  return (
    <div className={`${styles.dropdownBox} ${isOpen ? styles.dropdownOpen : ""}`} onClick={dropdownClickHandler}>
      <div className={styles.dropdownContents}>
        {children}
      </div>
    </div>
  );
}