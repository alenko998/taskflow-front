export default function Spinner({ size = 24, color = "var(--acc)" }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid rgba(255,255,255,.1)`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "spin .6s linear infinite",
      display: "inline-block",
    }} />
  );
}