import Axios from "axios";
import type { NewNote, Note } from "../types/note";


interface NotesHttpResponse {
  notes: Note[],
  totalPages: number,
}

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;



const axios = Axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    accept: "application/json",
      Authorization: `Bearer ${myKey}`,
    email: 'mikaella.hiyakuya@gmail.com'
  },
  params: {
  },
});

export async function getNotesByQuery(search: string, page: number): Promise<NotesHttpResponse>
{
  return axios
    .get<NotesHttpResponse>("/notes" , { params: { search, page } })
    .then((res) => res.data);
}

export function addNote(newNote: NewNote): Promise<Note> {
  return axios.post<Note>("/notes", newNote).then(res => res.data);
}

export function deleteNote(id: string): Promise<Note> {
  return axios.delete<Note>(`/notes/${id}`).then(res => res.data);
}