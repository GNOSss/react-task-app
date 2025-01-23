import React, { FC, useState } from 'react';
import { GrSubtract } from 'react-icons/gr';
import Task from '../Task/Task';
import ActionButton from '../ActionButton/ActionButton';
import { IList } from '../../types';
import { useTypedDispatch } from '../../hooks/redux';
import { deleteList, setModalActive } from '../../store/slices/boardsSlice';
import { addLog } from '../../store/slices/loggerSlice';
import { v4 as v4 } from 'uuid';
import { setModalData } from '../../store/slices/modalSlice';
import { listWarpper, header, name, deleteButton } from './List.css';
import { ITask } from '../../types';
import { Droppable } from '@hello-pangea/dnd';

type TListProps = {
  boardId: string;
  list: IList;
};

const List: FC<TListProps> = ({ list, boardId }) => {
  const dispatch = useTypedDispatch();

  const handleListDelete = (listId: string) => {
    dispatch(deleteList({ boardId, listId }));
    dispatch(
      addLog({
        logId: v4(),
        logMessage: `리스트 삭제하기 : ${list.listName}`,
        logAuthor: 'User',
        logTimestamp: String(Date.now()),
      })
    );
  };

  const handleTaskChange = (boardId: string, listId: string, taskId: string, task: ITask) => {
    dispatch(setModalData({ boardId, listId, task }));
    dispatch(setModalActive(true));
  };

  return (
    <Droppable droppableId={list.listId}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef} className={listWarpper}>
          <div className={header}>
            <div className={name}>{list.listName}</div>
            <GrSubtract className={deleteButton} onClick={() => handleListDelete(list.listId)} />
          </div>
          {list.tasks.map((task, index) => (
            <div onClick={() => handleTaskChange(boardId, list.listId, task.taskId, task)} key={task.taskId}>
              <Task taskName={task.taskName} taskDescription={task.taskDescription} boardId={boardId} id={task.taskId} index={index} />
            </div>
          ))}
          {provided.placeholder}
          <ActionButton boardId={boardId} listId={list.listId} />
        </div>
      )}
    </Droppable>
  );
};

export default List;
