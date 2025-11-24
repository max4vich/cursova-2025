import PropTypes from "prop-types";

const AdminTable = ({ columns, data, emptyLabel = "Дані відсутні", renderActions }) => {
  if (!data?.length) {
    return (
      <div className="admin-empty">
        <p>{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key || column.header}>{column.header}</th>
            ))}
            {renderActions && <th />}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id || row.key}>
              {columns.map((column) => (
                <td key={column.key || column.header}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              {renderActions && <td className="admin-table__actions">{renderActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

AdminTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      key: PropTypes.string,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  emptyLabel: PropTypes.string,
  renderActions: PropTypes.func,
};

export default AdminTable;

