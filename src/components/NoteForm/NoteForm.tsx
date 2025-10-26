import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useAddNote } from '../../services/noteService';
import css from './NoteForm.module.css'
import type { NewNote } from '../../types/note';
import * as Yup from "yup";

interface NoteFormProps {
  handleCancelNote: () => void,
  queryKey:  [string, string, number]
}


const Schema = Yup.object().shape({
  title: Yup.string().required("Title is required").min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long"),
  tag:  Yup.string().required("Tag is required")
});

export default function NoteForm({ handleCancelNote, queryKey }: NoteFormProps) {


const { addNote, isPending } = useAddNote(queryKey);


 const handleSubmit = (values: NewNote) => {
    addNote(values); 
  };

    const initialValues: NewNote = {
    title: "",
    content: "",
    tag: "Todo",
  };

  return (
    
      <Formik initialValues={initialValues} onSubmit={handleSubmit}  validationSchema={Schema}>
      {() =>  (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              name="title"
              type="text"
              className={css.input}
            />
             <ErrorMessage name="title" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
                <ErrorMessage name="tag" component="div" className={css.error} />
            </Field>
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={handleCancelNote}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={isPending}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
)
}