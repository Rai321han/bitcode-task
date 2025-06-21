export default function Badge({ type }) {
  let style = "";
  switch (type) {
    case "In progress":
      style = "bg-orange-400";
      break;
    case "Planned":
      style = "bg-blue-400";
      break;
    case "Completed":
      style = "bg-green-400";
      break;
  }
  return (
    <div className={`${style} text-white rounded-xl px-2 py-1 text-xs`}>
      <p>{type}</p>
    </div>
  );
}
