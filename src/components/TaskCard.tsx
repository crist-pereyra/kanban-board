import { useState } from 'react';
import { TrashIcon } from '../icons';
import { ID, Task } from '../types';

interface Props {
  task: Task;
  deleteTask: (id: ID) => void;
  updateTask: (id: ID, content: string) => void;
}
export const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
    setIsMouseOver(false);
  };

  if (isEditMode) {
    return (
      <div className='bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative'>
        <textarea
          value={task.content}
          autoFocus
          placeholder='Task content here'
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.shiftKey) toggleEditMode();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
          className='h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none'
        />
        <p className='absolute right-4 bottom-4 text-white/40 text-xs'>
          Press Shift+Enter to save
        </p>
      </div>
    );
  }
  return (
    <div
      onClick={toggleEditMode}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      className='bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task'
    >
      <p className='my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap'>
        {task.content}
      </p>
      {isMouseOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className='stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100'
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};
