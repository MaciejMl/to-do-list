import { useState, useEffect } from 'react';
import shortid from 'shortid';
import io from 'socket.io-client';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const newSocket = io('http://192.168.0.170:8000');
    setSocket(newSocket);

    newSocket.on('updateData', (data) => {
      setTasks(data);
    });

    newSocket.on('addTask', (data) => {
      addTask(data);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const addTask = (task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const removeTask = (id) => {
    socket.emit('removeTask', id);

    socket.on('updateData', (updatedTasks) => {
      setTasks(updatedTasks);
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    const newTask = { task: taskName, id: shortid() };
    addTask(newTask);
    socket.emit('addTask', newTask);
    setTaskName('');
  };

  return (
    <div className='App'>
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className='tasks-section' id='tasks-section'>
        <h2>Tasks</h2>

        <ul className='tasks-section__list' id='tasks-list'>
          {tasks.map((task) => (
            <li key={task.id} className='task'>
              {task.task}{' '}
              <button
                onClick={() => removeTask(task.id)}
                className='btn btn--red'
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={submitForm} id='add-task-form'>
          <input
            className='text-input'
            autoComplete='off'
            type='text'
            placeholder='Type your task'
            id='task-name'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button className='btn' type='submit'>
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
