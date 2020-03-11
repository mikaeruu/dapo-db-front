import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
	useTable,
	usePagination
} from 'react-table';
import styled from 'styled-components';


const Styles = styled.div` padding: 1rem; table { border-spacing: 0; border: 1px solid black; tr { :last-child { td { border-bottom: 0; } } }
    th, td { margin: 0; padding: 0.5rem; border-bottom: 1px solid black; border-right: 1px solid black; :last-child { border-right: 0; } } } `

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 2 },
    },
    usePagination
  )

  // Render the UI for your table
  return (
    <>
      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )

}

function Table_App(props) {
	const columns = React.useMemo(
		() => [
			{
				Header: 'User Data',
				columns: [
					{ Header: 'User Index', accessor: 'userIndex' },
					{ Header: 'Activity', accessor: 'activityDescription' },
					{ Header: 'Latitude', accessor: 'latitude' },
					{ Header: 'Longitude', accessor: 'longitude' }, 
					{ Header: 'Weather', accessor: 'weather' },
					{ Header: 'Humidity', accessor: 'humidity' },
					{ Header: 'Temperature', accessor: 'temperature' },
					{ Header: 'Pressure', accessor: 'pressure' },
					{ Header: 'Created at', accessor: 'created_at' },
				]
			}
		]
	)

	return (
		<Styles>
			<Table columns={columns} data={props.data} />
		</Styles>
	)
}


class DB_Table extends Component {
	constructor(props) {
		super(props);
		this.state = { apiResponse: [] };
	}

	callAPI() {
		let self = this;
		fetch('http://localhost:9000/db', {
			method: 'GET'
		}).then(function (response) {
			if (response.status >= 400) {
				throw new Error("Bad response from server");
			}
			return response.json();
		}).then(function (res) {
			self.setState({ apiResponse: res });
		}).catch(err => {
			console.log('caught it!', err);
		})
	}

	componentDidMount() {
		this.callAPI();
	}

	render() {
		return (
			<Table_App data={this.state.apiResponse}/>
		);
	}
}

export default DB_Table;