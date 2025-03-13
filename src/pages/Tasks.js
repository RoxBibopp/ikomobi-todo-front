import React, { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import InviteForm from '../components/InviteForm';
import { jwtDecode } from 'jwt-decode';
import CustomDropdown from '../components/CustomDropdown';

const Tasks = () => {
  const [board, setBoard] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [collabTasks, setCollabTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('mine');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString();

  const fetchBoard = async () => {
    try {
      const data = await fetchApi('/boards');
      setBoard(data);
    } catch (err) {
      setError('Erreur lors de la récupération du tableau');
      console.error(err);
    }
  };

  const fetchMyTasks = useCallback(async () => {
    try {
      const data = await fetchApi(`/tasks${filter ? `?status=${filter}` : ''}`);
      setMyTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erreur lors de la récupération des tâches');
      console.error(err);
    }
  }, [filter]);

  const fetchCollabTasks = useCallback(async () => {
    try {
      const data = await fetchApi(`/tasks/collaborations${filter ? `?status=${filter}` : ''}`);
      setCollabTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erreur lors de la récupération des tâches collaboratives');
      console.error(err);
    }
  }, [filter]);

  useEffect(() => {
    if (activeTab === 'mine') {
      fetchMyTasks();
    } else {
      fetchCollabTasks();
    }
  }, [activeTab, fetchMyTasks, fetchCollabTasks]);

  useEffect(() => {
    fetchBoard();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUser(decoded.pseudo);
    }
  }, []);
  
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await fetchApi('/tasks', { method: 'POST', body: newTask });
      setNewTask({ title: '', description: '' });
      fetchMyTasks();
    } catch (err) {
      setError('Erreur lors de la création de la tâche');
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await fetchApi(`/tasks/${taskId}`, {
        method: 'PUT',
        body: { status: newStatus }
      });
      activeTab === 'mine' ? fetchMyTasks() : fetchCollabTasks();
    } catch (err) {
      setError('Erreur lors de la mise à jour de la tache');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetchApi(`/tasks/${taskId}`, { method: 'DELETE' });
      activeTab === 'mine' ? fetchMyTasks() : fetchCollabTasks();
    } catch (err) {
      setError('Erreur lors de la suppression de la tâche');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!board) return <div>Chargement du tableau...</div>;

  return (
    
    <div className="taskContainer">
      <header className="taskHeader">
        <h2>Bonjour { currentUser } !</h2>
        <div className="date">Nous sommes le { today }</div>
        <div className="logout" onClick={handleLogout}>Déconnexion</div>
      </header>
      <div className="tasksTab">
        <div 
          onClick={() => setActiveTab('mine')}
          className={activeTab === 'mine' ? 'active' : ''}
        >
          Mes tâches
        </div>
        <div 
          onClick={() => setActiveTab('collab')}
          className={activeTab === 'collab' ? 'active' : ''}
        >
          Autres Tâches
        </div>
      </div>
      <div className='filtersCtn'>
        <div>Filtrer par statut :</div>
        <CustomDropdown
          value={filter}
          onChange={(newValue) => setFilter(newValue)}
        />
      </div>

      <div className="tasksList">
        {activeTab === 'mine' ? (
        <h3>Mes taches :</h3> 
        ): ('')}
        {activeTab === 'mine' ? (
          myTasks.length > 0 ? (
            myTasks.map((task) => (
              <div className="classComponent" key={task.id}>
                <div className="taskTitle">{task.title}</div>
                <div className="taskDesc">{task.description}</div>

                <div>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="a faire">À faire</option>
                    <option value="en cours">En cours</option>
                    <option value="terminé">Terminé</option>
                  </select>
                </div>
                <div className="deleteButton" onClick={() => handleDeleteTask(task.id)}>Supprimer cette tâche</div>
              </div>
            ))
          ) : (
            <div>Aucune tâche</div>
          )
        ) : (
          collabTasks.length > 0 ? (
            Object.entries(
              collabTasks.reduce((groups, task) => {
                const ownerName = (task.user && (task.user.pseudo || task.user.email)) || 'Inconnu';
                if (!groups[ownerName]) {
                  groups[ownerName] = [];
                }
                groups[ownerName].push(task);
                return groups;
              }, {})
            ).map(([ownerName, tasks]) => (
              <div key={ownerName}>
                <h3>Tâches de {ownerName}</h3>
                <div>
                  {tasks.map((task) => (
                    <div className="classComponent" key={task.id}>
                      <div className='taskTitle'>{task.title}</div>
                      <div className="taskDesc">{task.description}</div>
                      <div className="taskStatus">Status : {task.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div>Aucune tâche collaborative</div>
          )
        )}
      </div>

      {activeTab === 'mine' && (
        <div className="addTaskCtn">
          <h3>Ajouter une nouvelle tâche</h3>
          <form onSubmit={handleCreateTask}>
            <div>
              <label>Titre :</label><br/>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Description :</label><br/>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div class="addButton" type="submit">Ajouter</div>
          </form>
        </div>
      )}
      <div className="inviteCtn">
        <h3>Inviter un collaborateur</h3>
        <InviteForm boardId={board.id} onSuccess={activeTab === 'mine' ? fetchMyTasks : fetchCollabTasks} />

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default Tasks;
