import { useDeleteNote } from '../../services/noteService';
import type Note from '../../types/note'
import css from './NoteList.module.css'

interface NoteListProps {
  notes: Note[],
 queryKey: Array<string | number>;
}

export default function NoteList({ notes, queryKey }: NoteListProps) {

 const { deleteNote, isPending } = useDeleteNote(queryKey);



  return (<ul className={css.list}>
    {notes.map((note: Note) => (<li className={css.listItem} key={note.id}>
      <h2 className={css.title}>{note.title}</h2>
      <p className={css.content}>{note.content}</p>
      <div className={css.footer}>
        <span className={css.tag}>{note.tag}</span>
        <button className={css.button}  onClick={() => deleteNote(note.id) } disabled={isPending}  >Delete</button>
      </div>
    </li>))}
  </ul>)
}


