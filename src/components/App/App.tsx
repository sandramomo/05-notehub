
import {  useState, type MouseEventHandler } from 'react';
import SearchBox from '../SearchBox/SearchBox'
import css from './App.module.css'
import { useQuery } from '@tanstack/react-query';
import { getNotesByQuery} from '../../services/noteService';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import NoteList from '../NoteList/NoteList';
import { useDebouncedCallback } from 'use-debounce';
import Modal from '../Modal/Modal';
import ReactPaginate from 'react-paginate';




function App() {
  const [debouncedValue, setDebouncedValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [clicked, setClicked] = useState(false);
const queryKey: [string, string, number] = ["note", debouncedValue, currentPage];
  const handleFilterChange = (query: string) => {
  debouncedSearch(query);
  };
     
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setDebouncedValue(value);
  setCurrentPage(1);
}, 1000); 
  
  const { data, isLoading, isError, error, isFetching, isSuccess } = useQuery({
    queryKey: ["note", debouncedValue, currentPage],
    queryFn: () => getNotesByQuery(debouncedValue, currentPage),
    // enabled: debouncedValue.trim() !== '',
  });

const handleCreateClick: MouseEventHandler<HTMLButtonElement> = () => {
  setClicked(true);
};

  const totalPages = data?.totalPages ?? 0;

    return (<div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleFilterChange} />
      {totalPages>1 && <ReactPaginate 
    pageCount={totalPages}
    pageRangeDisplayed={5}
    marginPagesDisplayed={1}
    onPageChange={({ selected }) => setCurrentPage(selected + 1)}
    forcePage={currentPage - 1}
    nextLabel="→"
            previousLabel="←"
            containerClassName={css.pagination}
activeClassName={css.active}
  />} 
        <button className={css.button} onClick={handleCreateClick} >Create note +</button>
      </header>
      {isSuccess && data && <NoteList notes={data.notes} queryKey={queryKey} />}
      {isLoading || isFetching ? <Loader /> : null}
      {isError && <ErrorMessage error={error} />}
      { clicked && <Modal onClose={() => setClicked(false)} queryKey={queryKey} /> }
    </div>)

  
  }

export default App
