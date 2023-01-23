import React , { useContext, useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import Layout from 'components/Layout'
import Head from 'next/head';
import styles from 'styles/Projects.module.css'
import { AiOutlineArrowRight } from 'react-icons/ai'
import Link from 'next/link';
import AddTask from 'components/addTask/AddTask';
import {ModalContext} from 'components/ModalsContext';
import toast, { Toaster } from 'react-hot-toast';


const fetcher = (...args) => fetch(...args).then(res => res.json());
async function sendRequest(url, { arg }) {
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(arg)
    })
}

const Project = ({id}) => {

    const { data } = useSWR(`/api/projects/${id}`, fetcher);
    const { trigger } = useSWRMutation(`/api/projects/${id}`, sendRequest);
    const {modalAddTaskOpen, setModalTaskVisibility} = useContext(ModalContext);
    const [ taskValue , setTaskValue ] = useState({title:'', description:''});

    const setModalState = () =>
    {
        setModalTaskVisibility(!modalAddTaskOpen)
    }

    const deleteAll = async () =>
    {   
        if(data && data.tasks.length === 0 )
        {
            toast.error('Proyecto sin tareas!', {
                icon: '⚠️',
                position: "bottom-center",
                duration: 3500,
                style: {
                    fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
            });
            return
        }
        const isDeleted = await trigger(null);
        if(isDeleted.status === 200){
            toast.success('Tareas eliminadas!', {
                position: "bottom-center",
                duration: 3500,
                style: {
                    fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
            }); 
        }
        else{
            toast.error(isDeleted.error , {
                position: "bottom-center",
                duration: 3500,
                style: {
                    fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
            });
        }

    }

    const handleEditTask = (e, index, title, description ) =>
    {
        e.preventDefault();
        setTaskValue({
            title: title,
            description: description,
            index: index
        });
        setModalState();
        setTimeout(() => {
            setTaskValue({
                title: '',
                description: '',
                index: -1
            });
        }, 1000);
    }

    const handleDeleteTask = async (e, index) =>
    {
        e.preventDefault();
        const isDeleted = await trigger({title:'',description:'', index: index});
        if(isDeleted.status === 200){
            toast.success('Tarea eliminada!', {
                position: "bottom-center",
                duration: 3500,
                style: {
                    fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
            }); 
        }
    }

    return (
        <>
            <Head>
                <title>Project - Project Manager App</title>
                <meta name="description" content="Project Manager App" />
            </Head>
            <Layout>
                <div className={styles.container}>
                    <div className={styles.container__header}>
                        <div className={styles.container__header_add}>
                            <Link href='/projects'>Proyectos</Link>
                            <AiOutlineArrowRight></AiOutlineArrowRight>
                            {data && (
                                <div className={styles.container__header_project}>
                                    <p style={{ backgroundColor:`#EF4F1A`}}>{data.name.slice(0,1)}</p>  
                                    <h2 style={{color:'#333'}}>{data.name}</h2>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.menuContainer}>
                        <div className={styles.menuContainer__title}>
                            <h2>Tareas</h2>
                        </div>
                        <div className={styles.menuContainer__buttons}>
                            <button onClick={setModalState}>Agregar</button>    
                            <button onClick={deleteAll}>Eliminar todas</button>    
                        </div>
                    </div>
                    <div className={styles.taskContainer}>
                        {   
                            data && (
                                data.tasks.length > 0 ? (
                                    data.tasks.map((task, index) =>{
                                        return (
                                            <div className={styles.taskContainer__item} key={index}>
                                                <h2 style={{color:'#333'}}>{task.title}</h2>
                                                <h3 style={{color:'#333'}}>{task.description}</h3>
                                                <div>
                                                    <button onClick={(e)=> handleEditTask(e, index, task.title, task.description)}>Editar</button>
                                                    <button onClick={(e)=> handleDeleteTask(e, index, task.title, task.description)}>Eliminar</button>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : <h4 style={{color:'#333'}}>Todavía no hay tareas en este proyecto ...</h4>
                            )
                        }
                    </div>
                </div>
                {
                    modalAddTaskOpen && (
                        <AddTask id={id} instance={taskValue}></AddTask>
                    )
                }
                <Toaster/>
            </Layout>
        </>
    )
}

export async function getServerSideProps ({params}) {

    const {id} = params;
    return {
        props: {
            id
        }
    }
}

export default Project