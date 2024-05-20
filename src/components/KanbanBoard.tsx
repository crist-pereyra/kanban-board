import { useMemo, useState } from 'react';
import { PlusIcon } from '../icons';
import { Column, ID, Task } from '../types';
import { ColumnContainer } from './ColumnContainer';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );
  const columnsId = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );
  const createTask = (columnId: ID) => {
    const newTask: Task = {
      id: generateId(),
      columId: columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: ID) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  };
  const updateTask = (id: ID, content: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, content };
      }
      return task;
    });
    setTasks(updatedTasks);
  };
  const createColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  };

  const generateId = () => {
    return Math.floor(Math.random() * 10001);
  };
  const deleteColumn = (id: ID) => {
    const filteredColumns = columns.filter((column) => column.id !== id);
    setColumns(filteredColumns);
  };

  const updateColumn = (id: ID, title: string) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === id) {
        return { ...column, title };
      }
      return column;
    });
    setColumns(updatedColumns);
  };
  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeColumId = active.id;
    const overColumId = over.id;
    if (activeColumId === overColumId) return;
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (column) => column.id === activeColumId
      );
      const overColumnIndex = columns.findIndex(
        (column) => column.id === overColumId
      );
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };
  return (
    <div className='m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]'>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className='m-auto flex gap-4'>
          <div className='flex gap-4'>
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columId === column.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createColumn}
            className='h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2'
          >
            <PlusIcon />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((task) => task.columId === activeColumn.id)}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};
