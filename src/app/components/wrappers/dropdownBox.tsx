import React, { useState, useRef, useEffect } from "react";;

import { getGlowSibling } from "../wrappers/siblingBinder";

import styles from "@/app/styles/semiComponents.module.css"

export default function DropdownBox({children, placeholder}: {children: React.ReactNode, placeholder: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function dropdownClickHandler(e: React.MouseEvent) {
    e.stopPropagation();
    const newState = !isOpen;
    setIsOpen(newState);
    const sibling = getGlowSibling(ref.current as HTMLElement);
    if (sibling) {
      sibling.classList.toggle(styles.dropdownOpen, newState);
    }
  }

  // Bind box scroll with glow scroll
  useEffect(() => {
    const elem = ref.current;

    // Bind scroll event to the sibling element
    function scrollHandler() {
      if (elem == null) return;
      const scrollAmount = elem.scrollTop;
      const sibling = getGlowSibling(elem);
      if (sibling != null) sibling.scrollTop = scrollAmount;
    }
    
    elem?.addEventListener('scroll', scrollHandler);

    // Mouse clicked outside detection
    function mouseHandler(e: MouseEvent) { 
      if (e.target == null) return;
      if (!elem?.contains(e.target as Node) &&  isOpen) {
        setIsOpen(false);
        
        const sibling = getGlowSibling(ref.current as HTMLElement);
        if (sibling) {
          sibling.classList.toggle(styles.dropdownOpen, false);
        }
      }
    }

    document.addEventListener('mousedown', mouseHandler);

    return () => {
      if (elem) {
        elem.removeEventListener('scroll', scrollHandler);
        document.removeEventListener('mousedown', mouseHandler);
      }
    };
  }, [isOpen])

  return (
    <div ref={ref} className={`${styles.dropdownBox} ${isOpen ? styles.dropdownOpen : ""}`} onClick={dropdownClickHandler}>
      {placeholder}
      <div className={styles.dropdownContents}>
        {children}
      </div>
    </div>
  )
}