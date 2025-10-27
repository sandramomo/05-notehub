import { useState, type MouseEventHandler } from "react";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";
import { useQuery } from "@tanstack/react-query";
import { getNotesByQuery } from "../../services/noteService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useDebouncedCallback } from "use-debounce";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";

function App() {
  const [debouncedValue, setDebouncedValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryKey: [string, string, number] = ["note", debouncedValue, currentPage];

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setDebouncedValue(value);
    setCurrentPage(1);
  }, 1000);

  const handleFilterChange = (query: string) => {
    debouncedSearch(query);
  };
  const { data, isLoading, isError, error, isFetching, isSuccess } = useQuery({
    queryKey,
    queryFn: () => getNotesByQuery(debouncedValue, currentPage),
    placeholderData: (prev) => prev, 
  });

  const handleCreateClick: MouseEventHandler<HTMLButtonElement> = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleFilterChange} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button className={css.button} onClick={handleCreateClick}>
          Create note +
        </button>
      </header>

      {isSuccess && data && <NoteList notes={data.notes} queryKey={["note", debouncedValue, currentPage]} />}

      {(isLoading || isFetching) && <Loader />}

      {isError && <ErrorMessage error={error} />}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm handleCancelNote={handleCloseModal} queryKey={queryKey} />
        </Modal>
      )}
    </div>
  );
}

export default App;