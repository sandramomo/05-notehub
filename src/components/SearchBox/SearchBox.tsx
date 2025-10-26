import { useState } from 'react';
import css from './SearchBox.module.css'



interface QuerySearchProps {
    onSearch: (query: string) => void;
}

export default function SearchBox({onSearch}:QuerySearchProps) {

const [query, setQuery] = useState("");
  
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value.trim())
  };

return (<input 
      className={css.input}
      type="text"
      placeholder="Search notes"
       value={query}
      onChange={handleInput}
    />
    )
  
}