import { useEffect } from "react";
import "../styles/ripple.css";

function RippleBackground() {

  useEffect(() => {

    const handleClick = (e) => {

      const ripple = document.createElement("span");

      ripple.className = "ripple";

      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;

      document.body.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 1000);

    };

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);

  }, []);

  return null;
}

export default RippleBackground;