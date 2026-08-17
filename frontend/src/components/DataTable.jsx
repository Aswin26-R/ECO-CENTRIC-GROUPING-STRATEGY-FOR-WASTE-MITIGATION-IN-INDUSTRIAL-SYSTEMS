export default function DataTable({ columns, children, emptyMessage = "No records found." }) {
  const hasRows = Array.isArray(children) ? children.length > 0 : !!children;

  return (
    <div className="overflow-x-auto rounded-xl border border-charcoal-100">
      <table className="min-w-full divide-y divide-charcoal-100 text-sm">
        <thead className="bg-charcoal-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-charcoal-500"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal-100 bg-white">
          {hasRows ? (
            children
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-charcoal-400">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
