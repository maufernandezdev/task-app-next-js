const DeleteProject = async (id) =>
{   
    const url = `/api/projects/${id}`;
    const isDeleteSuccess = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify({id:id})
      })
    return isDeleteSuccess
}

export default DeleteProject;