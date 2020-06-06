const camelize = (str) =>
  str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });

const mapRowsAndCols = (row, columns) => {
  const valuesArray = Object.entries(row.values).map(([key, value]) => ({
    name: columns[key],
    value,
  }));

  const values = valuesArray.reduce(
    (res, curr) => ({ ...res, [camelize(curr.name)]: curr.value }),
    {}
  );
  return { ...values };
};

export const coda = (instance) => {
  const getTableColumns = ({ docId, tableIdOrName }) =>
    instance.get(`/docs/${docId}/tables/${tableIdOrName}/columns`);

  const getTableRows = ({ docId, tableIdOrName }) =>
    instance.get(`/docs/${docId}/tables/${tableIdOrName}/rows`, {
      params: { sortBy: 'natural' },
    });

  const getViewColumns = ({ docId, viewIdOrName }) =>
    instance.get(`/docs/${docId}/views/${viewIdOrName}/columns`);

  const getViewRows = ({ docId, viewIdOrName }) =>
    instance.get(`/docs/${docId}/views/${viewIdOrName}/rows`, {
      params: { sortBy: 'natural' },
    });

  const getTableData = async ({ docId, tableIdOrName }) => {
    const { data: dataColumns } = await getTableColumns({
      docId,
      tableIdOrName,
    });
    const { data: dataRows } = await getTableRows({ docId, tableIdOrName });
    const columns = dataColumns.items.reduce(
      (res, curr) => ({ ...res, [curr.id]: curr.name }),
      {}
    );
    return dataRows.items.map((row) => mapRowsAndCols(row, columns));
  };

  const getViewData = async ({ docId, viewIdOrName }) => {
    const { data: dataColumns } = await getViewColumns({ docId, viewIdOrName });
    const { data: dataRows } = await getViewRows({ docId, viewIdOrName });
    const columns = dataColumns.items.reduce(
      (res, curr) => ({ ...res, [curr.id]: curr.name }),
      {}
    );
    return dataRows.items.map((row) => mapRowsAndCols(row, columns));
  };

  return { getTableData, getViewData };
};
