import { useState, useEffect } from 'react';
import shortid from 'shortid';
import io from 'socket.io-client';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([
    { task: 'lody', id: 1 },
    { task: 'lodyczerwone', id: 2 },
  ]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  const removeTask = (id) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
    socket.emit('removeTask', id);
  };

  const addTask = (task) => setTasks((tasks) => [...tasks, task]);

  const submitForm = (e) => {
    e.preventDefault();
    addTask({ task: taskName, id: shortid() });
    console.log(tasks);
    console.log(taskName);
    console.log(addTask);
    socket.emit('addTask', addTask);
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
            placeholder='Type your description'
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
