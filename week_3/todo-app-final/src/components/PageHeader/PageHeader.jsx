import "./PageHeader.css";

function PageHeader({ currentPage, setCurrentPage }) {
  return (
    <div id="page-header">
      {currentPage === 0 && (
        <button onClick={() => setCurrentPage(1)}>Add new task</button>
      )}
      {currentPage === 1 && (
        <button onClick={() => setCurrentPage(0)}>Show Task List</button>
      )}
    </div>
  );
}

export default PageHeader;
