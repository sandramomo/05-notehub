import Axios from "axios";
import type Note from "../types/notes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NewNote } from "../types/notes";


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

export function getNotesByQuery(search: string, page: number): Promise<NotesHttpResponse>
{
  return axios
    .get<NotesHttpResponse>("/notes" , { params: { search, page } })
    .then((res) => res.data);
}


export function useAddNote(query:  [string, string, number]) {

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newNote: NewNote) => {
      const res = await axios.post("/notes", newNote);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: query });
    },
    onError: (error) => {
      console.error("Error adding note:", error);
    },
  });

  const addNote = (note: NewNote) => {
    mutation.mutate(note);
  };

  return { addNote, ...mutation };
}

export function useDeleteNote(queryKey:  Array<string | number>) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id:string) => {
      const res = await axios.delete(`/notes/${id}`);
       return res.data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
    },
  });

  const deleteNote = (id: string) => {
    mutation.mutate(id);
  };

  return { deleteNote, ...mutation };
}
