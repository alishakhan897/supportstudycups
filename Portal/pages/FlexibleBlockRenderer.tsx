type FlexibleValue =
  | string
  | string[]
  | {
      columns: string[];
      rows: string[][];
    };

const FlexibleBlockRenderer = ({
  value
}: {
  value?: FlexibleValue;
}) => {
  if (!value) return null;

  // TEXT
  if (typeof value === "string") {
    return (
      <p className="text-slate-700 leading-relaxed">
        {value}
      </p>
    );
  }

  // LIST
  if (Array.isArray(value)) {
    return (
      <ul className="space-y-2">
        {value.map((item, i) => (
          <li key={i} className="flex gap-2 text-slate-700">
            <span className="text-blue-600">➤</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  // TABLE
  if ("columns" in value && "rows" in value) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-slate-100">
            <tr>
              {value.columns.map((c, i) => (
                <th key={i} className="border p-2 text-left">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {value.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="border p-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};

export default FlexibleBlockRenderer;
