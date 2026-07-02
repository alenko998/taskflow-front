import { useState } from "react";

export default function Card({ children, padding = "24px", style = {}, onClick, hover = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: "var(--surface)",
        border: `1px solid ${hovered ? "var(--border-2)" : "var(--border)"}`,
        borderRadius: "var(--radius)",
        padding,
        cursor: onClick ? "pointer" : "default",
        transition: "border-color var(--t), transform var(--t)",
        transform: hovered && hover ? "translateY(-1px)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}