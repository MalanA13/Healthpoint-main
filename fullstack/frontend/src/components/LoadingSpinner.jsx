export default function LoadingSpinner({ text = "Memuat data..." }) {
  return (
    <div className="loading-spinner">
      <span />
      <p>{text}</p>
    </div>
  );
}
