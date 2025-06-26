import React, { useState, useRef, useEffect } from "react";;

import { getGlowSibling } from "../wrappers/siblingBinder";

import styles from "@/app/styles/semiComponents.module.css"

export default function DropdownBox({children, forceOpen = false, clickable = false, className = "", placeholder = null}: {children: React.ReactNode, forceOpen?: boolean, clickable? : boolean, className?: string ,placeholder?: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function dropdownClickHandler(e: React.MouseEvent) {
    if (!clickable) return;

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

    if (clickable) document.addEventListener('mousedown', mouseHandler);

    return () => {
      if (elem) {
        elem.removeEventListener('scroll', scrollHandler);
        document.removeEventListener('mousedown', mouseHandler);
      }
    };
  }, [isOpen, clickable])

  return (
    <div ref={ref} className={`${className} ${styles.dropdownBox} ${(forceOpen || isOpen) ? styles.dropdownOpen : ""}`} onClick={dropdownClickHandler}>
      {placeholder && placeholder}
      <div className={styles.dropdownContents}>
        {children}
      </div>
    </div>
  )
}