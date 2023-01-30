import React , { useState, useContext } from 'react';
import styles from './UpdateDeleteProject.module.css'
import 'bootstrap/dist/css/bootstrap.css'
import {ModalContext} from 'components/ModalsContext';
import {Modal} from 'reactstrap';
import useSWRMutation from 'swr/mutation'
import toast, { Toaster } from 'react-hot-toast';
import deleteProject from 'utils/deleteProject'
import { useRouter } from 'next/router'

async function sendPatchRequest(url, { arg }) {
  return fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(arg)
  })
}

export default function UpdateDeleteProject() {

  const {modalUpdateDeleteProject, setModalUpdateDeleteProjectVisibility, selectedProject} = useContext(ModalContext);
  const { trigger } = useSWRMutation(`/api/projects/${selectedProject.id}`, sendPatchRequest);
  const [project , setProject] = useState({id: selectedProject.id, name: selectedProject.name});
  const router = useRouter()

  const handleSubmit = async (e) =>
  {
        e.preventDefault();
        if(project.name.length > 0 && project.name.length < 41)
        { 
          const isEdited = await trigger(project);
          if(isEdited.status === 200)
          { 
            toast.success('Proyecto guardado!',{
              position: "bottom-center",
              duration: 3500,
              style: {
                  fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
            })
            setTimeout(() => {
              setModalUpdateDeleteProjectVisibility(false);
              router.reload(window.location.pathname) // fixme -> render cards
            }, 1000);

          }
          else if(isEdited.status === 400){
            const { duplicate } = await isEdited.json()
            const text = `El proyecto "${duplicate}" ya existe!`
            toast.error(text,{
              position: "top-center",
              duration: 3500,
              style: {
                  fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
            });
          }
          else{
            console.log('is edited?: ', isEdited);
            toast.error('Ocurrió un error!',{
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

  const handleDelete = async () =>
  { 
    const isDeleted = await deleteProject(project.id);
    if(isDeleted.status === 200)
    { 
      toast.success('Proyecto eliminado!',{
        position: "bottom-center",
        duration: 3500,
        style: {
            fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
      })
      setTimeout(() => {
        setModalUpdateDeleteProjectVisibility(false);
        router.reload(window.location.pathname) // fixme -> render cards
      }, 1000);
    }
    else{
      toast.error('Ocurrió un error!',{
        position: "top-center",
        duration: 3500,
        style: {
            fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
      });
    }
  }

  return (
    <Modal isOpen={modalUpdateDeleteProject} toggle={() => setModalUpdateDeleteProjectVisibility(false)} className={styles.modal}>
      <form className={styles.modal__container} onSubmit={handleSubmit}>
        <div className={styles.modal__header}> 
            <button
              aria-label="Close"
              className=" close"
              onClick={() => setModalUpdateDeleteProjectVisibility(false)}
              type="button">
              <span aria-hidden={true}>×</span>
            </button> 
          </div>
        <h5>Nombre del proyecto</h5>
        <input type="text" name='name' placeholder='Ejemplo: Cliente, Tarea, etc' onChange={handleChange} value={project.name || ''} />
        <div className={styles.buttonContainer}>
            <input type="button"  value='Eliminar' onClick={handleDelete} />
            <input type="submit"  value='Guardar' className={project.name && project.name.length > 0 ? styles.valid : styles.invalid}/>
        </div>
      </form>
      <Toaster/>
    </Modal>
  );
}