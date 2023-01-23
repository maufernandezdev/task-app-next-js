import React , { useState, useContext } from 'react';
import styles from './AddProject.module.css'
import 'bootstrap/dist/css/bootstrap.css'
import {ModalContext} from 'components/ModalsContext';
import {Modal} from 'reactstrap';
import useSWRMutation from 'swr/mutation'
import toast, { Toaster } from 'react-hot-toast';

async function sendRequest(url, { arg }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  })
}

export default function AddProject() {

  const {modalAddProjectOpen, setModalProjectVisibility} = useContext(ModalContext);
  const { trigger } =  useSWRMutation('/api/projects', sendRequest);
  const [project , setProject] = useState({ name: ''});

  const handleSubmit = async (e) =>
  {
        e.preventDefault();
        if(project.name.length > 0 && project.name.length < 41)
        { 
          const isCreated = await trigger(project);
          if(isCreated.status === 200)
          { 
            toast.success('Proyecto creado!',{
              position: "bottom-center",
              duration: 3500,
              style: {
                  fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
            })
            setTimeout(() => {
              setModalProjectVisibility(false);
            }, 1000);
          }
          else if(isCreated.status === 400){
            const { duplicate } = await isCreated.json()
            const text = `El proyecto "${duplicate}" ya existe!`
            toast.error(text,{
              position: "top-center",
              duration: 3500,
              style: {
                  fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
            });
          }
        }
        if(project.name.length > 41)
        {
          toast.error('Nombre demasiado largo!',{
            position: "bottom-center",
            duration: 3500,
            style: {
                fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
          });
        }
  }

  const handleChange = (e) =>
  { 
    setProject({
      ...project,
      [e.target.name]: e.target.value
    });
  }


  return (
    <Modal isOpen={modalAddProjectOpen} toggle={() => setModalProjectVisibility(false)} className={styles.modal}>
      <form className={styles.modal__container} onSubmit={handleSubmit}>
        <div className={styles.modal__header}> 
            <button
              aria-label="Close"
              className=" close"
              onClick={() => setModalProjectVisibility(false)}
              type="button">
              <span aria-hidden={true}>×</span>
            </button> 
          </div>
        <h5>Nombre del proyecto</h5>
        <input type="text" name='name' placeholder='Ejemplo: Cliente, Tarea, etc' onChange={handleChange} value={project.name || ''} />
        <div className={styles.buttonContainer}>
            <input type="button"  value='Cancelar' onClick={() => setModalProjectVisibility(false)} />
            <input type="submit"  value='Crear' className={project.name.length > 0 ? styles.valid : styles.invalid}/>
        </div>
      </form>
      <Toaster/>
    </Modal>
  );
}