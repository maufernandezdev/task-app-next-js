import styles from 'styles/Home.module.css'
import { BsSquare } from 'react-icons/bs'
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';
import useForm from 'hooks/useForm';
import toast, { Toaster } from 'react-hot-toast';

async function sendRequest(url, { arg }) {
  
  if(arg !== undefined)
  {
    return fetch(url, {
          method: 'PUT',
          body: JSON.stringify(arg)
      })
  }

  return fetch(url, {
    method: 'DELETE',
  })
  
}

const Card = ({task}) => {

  const { _id:id } = task; 

  const { trigger } = useSWRMutation(`/api/tasks/${id}`, sendRequest);
  const [exists , setExists] = useState(true);
  const [edit , setEdit] = useState(false);
  const colors = ['673de6','EF4F1A','1798B5','B51749','E2F87D','63D93E'];
  
  const [title , setTitle] = useState(task.title);
  const [description , setDescription] = useState(task.description);
  const [borderColor, setBorderColor] = useState(task.border);

  const notifySuccess = (text) => toast.success(text,{
    duration: 1500,
    style: {
        fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
    },
  );

  const notifyError = (text) => toast.error(text,{
    duration: 1500,
    style: {
        fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
    },
  );

  const handleColor = (e, color) =>
  { 
    e.preventDefault();
    console.log(color);
    setBorderColor(color);
  }

  const handleError = (statusCode) =>
  {
    if(statusCode === 404) return notifyError('Tarea no encontrada!');
    if(statusCode === 400) return notifyError('Metodo no soportado!');
    if(statusCode === 500) return notifyError('Error!');
  }

  const deleteTask = async () =>
  {
    const {status} = await trigger();
    if(status === 200)
    {
      setExists(false);
      return notifySuccess('Tarea eliminada!');
    }
    handleError(status);
  }
  
  const editTask = async () =>
  {
    values.border = borderColor;
    if (Object.keys(errors).length === 0)
    {
      const {status} = await trigger(values);
      if(status === 200)
      { 
        setTitle(values.title);
        setDescription(values.description);
        setEdit(false);
        return notifySuccess('Tarea editada!');   
      }
      handleError(status);
    }
  }

  const setEditState = () =>
  {  
    setEdit(!edit)
  }

  const validationsForm = (values) => 
    {
        let errors = {};
        let regexTitle = /^.{1,40}$/;
        let regexDescription = /^.{1,200}$/;

        
        if (!values.title.trim())
        {
          errors.title = "El campo 'Título' es requerido";
        }
        else if (!regexTitle.test(values.title.trim()))
        {
          errors.title = "El título excede los 40 caracteres";
        }
        
        if (!values.description.trim())
        { 
          errors.description = "El campo 'Descripción' es requerido";
        } 
        else if (!regexDescription.test(values.description.trim()))
        {  
          errors.description = "La descripción excede los 200 caracteres";
        }

        return errors;
  }

  const initialForm = {
      title: title,
      description: description,
      border: borderColor
  };

  const { values, errors , handleInputChange , handleBlur} = useForm(initialForm, validationsForm);

  return (
    <>

      { exists && (
        <div key={id} className={`${styles.card}`} style={{ borderLeft: `4px solid #${borderColor}`}}>
            <div className={styles.card__header}>
                <h2>#{id.toString().slice(0,3)}...{id.toString().slice(-3)}</h2>
            </div>
            <div className={styles.card__body}>
                {
                  edit && (
                    <>
                    
                      <input 
                        type='text'
                        name='title'
                        className={errors.title? styles.form__input : styles.form__valid}
                        placeholder='Ingrese un título'
                        onChange={e => handleInputChange(e)}
                        onBlur={handleBlur}
                        required
                        value={values.title || ''}
                        autoFocus
                        />
                        {errors.title && <p className={styles.form__error}>{errors.title}</p>}

                      <textarea 
                        name='description'
                        className={errors.description? styles.form__input : styles.form__valid}
                        cols='30' rows='4'
                        placeholder='Ingrese una descripción'
                        onChange={e => handleInputChange(e)}
                        onBlur={handleBlur}
                        required
                        value={values.description || ''}
                      />
                      {errors.description && <p className={styles.form__error}>{errors.description}</p>}

                      <div className={styles.card__colors}>
                        {
                          colors.map((color, index)=> {
                            return(
                              <BsSquare key={index} style={{ backgroundColor: `#${color}`}} onClick={(e) => handleColor(e, color)}></BsSquare>
                            )
                          })
                        }
                      </div>

                    </>
                  )
                }
                {
                  !edit && (
                    <>
                      <h2>{title}</h2>
                      <p className={styles.card__description}>{description}</p>
                    </>
                  )
                }
                <div className={styles.button__container}>
                  {
                    edit && (
                      <button onClick={editTask} className={styles.card__button}>Guardar</button>
                    )
                  }
                  {
                    !edit && (
                      <>
                        <button onClick={setEditState}>Editar</button>
                        <button onClick={deleteTask}>Eliminar</button>
                        {/* <button onClick={handleColor}>Color</button> */}
                      </>
                    )
                  }
                </div>
            </div>
        </div>
        ) 
      }
       <Toaster className={styles.customToast}/>
    </>
  )
}

export default Card;