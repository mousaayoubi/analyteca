export default function SectionCard({ title, actions, children }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {actions ? <div>{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
