import React , { useState, useContext , useRef } from 'react';
import styles from './AddTask.module.css'
import 'bootstrap/dist/css/bootstrap.css'
import { ModalContext } from 'components/ModalsContext';
import { Modal } from 'reactstrap';
import useSWRMutation from 'swr/mutation'
import toast, { Toaster } from 'react-hot-toast';
import useForm from 'hooks/useForm';

async function sendRequest(url, { arg }) {
  return fetch(url, {
    method: 'PUT',
    body: JSON.stringify(arg)
  })
}

export default function AddTask({id, instance}) {

  const initialTitle = instance.title || '';
  const initialDescription = instance.description || '';
  const [indexToEdit, setIndexToEdit] = useState(instance.index);
  const editInstance = initialTitle !== ''|| initialDescription !== '';
  const [isEdit, setIsEdit] = useState(editInstance)
  const {modalAddTaskOpen, setModalTaskVisibility} = useContext(ModalContext);
  const [inputErrors, setInputErrors] = useState({title: '',description: ''})
  const title = useRef()
  const desc = useRef()
  const { trigger } = useSWRMutation(`/api/projects/${id}`, sendRequest);

  const initialForm = {
    title: initialTitle,
    description: initialDescription,
    index: indexToEdit
  }

  const initialErrors = {
    title : isEdit ? '' : 'Nombre requerido',
    description : isEdit ? '' : 'Descripción requerida'
  }

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    const formValues = {
      title: title.current.value,
      description: desc.current.value,
      index: indexToEdit
    }

    validationsForm(formValues);
    if (Object.keys(errors).length === 0 || (errors.title === '' && errors.description === ''))
    { 
      const isCreated = await trigger(values);
      if(isCreated.status === 200)
      { 
        const text = isEdit ? 'Tarea guardada!' : 'Tarea creada!';
        toast.success(text, {
        position: "bottom-center",
        duration: 3500,
        style: {
            fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
        }); 
        setTimeout(() => {
          setModalTaskVisibility(false);
        }, 1000);
      }
    }
    else {
      let text = '';
      errors.title? text += `-> ${errors.title} \n` : text += '';
      errors.description? text += `-> ${errors.description} ` : text += '';
      if( errors.title || errors.description)
      { 
        toast.error(text,{
        position: "top-center",
        duration: 3500,
        style: {
            fontSize:'0.85em',
            fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
        }); 
      }
    }
  }

  const validationsForm = (values) => 
  {
    let errors = {};
    let regexTitle = /^.{1,40}$/;
    let regexDescription = /^.{1,200}$/;

    if(!values.title.trim())
    {
      errors.title = "Nombre requerido";
    }
    else if(!regexTitle.test(values.title.trim()))
    {
      errors.title = "Nombre demasiado largo";
    }
    
    if(!values.description.trim())
    { 
      errors.description = "Descripción requerida";
    } 
    else if(!regexDescription.test(values.description.trim()))
    {
      errors.description = "Descripción demasiado larga";
    }
    setInputErrors(errors);
    return errors;
  }

  const { values, errors , handleInputChange , handleBlur} = useForm(initialForm, initialErrors , validationsForm);

  return (
    <Modal isOpen={modalAddTaskOpen} toggle={() => setModalTaskVisibility(false)} className={styles.modal}>
      <form className={styles.modal__container} onSubmit={handleSubmit}>
        <div className={styles.modal__header}> 
            <button
              aria-label="Close"
              className=" close"
              onClick={() => setModalTaskVisibility(false)}
              type="button">
              <span aria-hidden={true}>×</span>
            </button> 
        </div>
        <h5>Nombre de la tarea</h5>
        <input 
          type='text'
          name='title'
          placeholder='Ejemplo: Feature, Fix, Story, etc' 
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={inputErrors.title ? styles.invalidInput : styles.validInput}
          ref={title}
          value={values.title}
           
        />
        <h5>Descripción</h5>
        <textarea
          name='description'
          cols="30" rows="5"
          placeholder='Ejemplo: El cliente "Mercado Libre" solicita el siguiente cambio ...'
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={inputErrors.description ? styles.invalidInput : styles.validInput}
          ref={desc}
          value={values.description}
         />
        <div className={styles.buttonContainer}>
            <input type="button"  value='Cancelar' onClick={() => setModalTaskVisibility(false)} />
            <input type="submit"  value={isEdit ? 'Guardar' : 'Crear' } className={styles.valid} />
        </div>
      </form>
      <Toaster/>
    </Modal>
  );
}