import React, { createContext, useDebugValue, useState } from 'react'

export const ModalContext = createContext();

const ModalProvider = ({ children }) => {

    const [selectedProject, setSelectedProject] = useState({})
    const [modalUpdateDeleteProject, setModalUpdateDeleteProject] = useState(false);
    const [modalAddProjectOpen, setModalAddProjectOpen] = useState(false);
    const [modalAddTaskOpen, setModalAddTaskOpen] = useState(false);

    const setModalProjectVisibility = (visibility) =>
    {
        setModalAddProjectOpen(visibility);
    }

    const setModalTaskVisibility = (visibility) =>
    {
        setModalAddTaskOpen(visibility)
    }

    const setModalUpdateDeleteProjectVisibility = (visibility) =>
    {
        setModalUpdateDeleteProject(visibility)
    }

    const setProjectToUpdateDelete = (project) =>
    {
        setSelectedProject(project)
    }

    return (
        <ModalContext.Provider value={{modalAddProjectOpen , setModalProjectVisibility,
            modalAddTaskOpen, setModalTaskVisibility,
            modalUpdateDeleteProject, setModalUpdateDeleteProjectVisibility,
            selectedProject, setProjectToUpdateDelete
        }}> {children} </ModalContext.Provider>
    )
}

export default ModalProvider;