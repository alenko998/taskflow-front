export default function Avatar({ name = "", size = 36, color }) {
  const colors = [
    "#6C63FF", "#00D4AA", "#F59E0B", "#EF4444",
    "#10B981", "#3B82F6", "#EC4899", "#8B5CF6",
  ];

  const initials = name
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const bg = color || colors[name.charCodeAt(0) % colors.length];

  return (
    <div style={{
      width: size, height: size,
      borderRadius: "50%",
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36,
      fontWeight: 600,
      color: "#fff",
      flexShrink: 0,
      userSelect: "none",
    }}>
      {initials || "?"}
    </div>
  );
}