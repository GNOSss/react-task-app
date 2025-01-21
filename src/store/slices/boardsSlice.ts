import { createSlice } from '@reduxjs/toolkit';
import { IBoard } from '../../types';

type TBoardsState = {
  modalActive: boolean;
  boardArray: IBoard[];
};

const initialState: TBoardsState = {
  modalActive: false,
  boardArray: [
    {
      boardId: 'board-0',
      boardName: '첫 번째 게시물',
      lists: [
        {
          listId: 'lists-0',
          listName: 'List 1',
          tasks: [
            {
              taskId: 'task-0',
              taskName: 'Task 1',
              taskDescription: 'Task 1 Description',
              taskOwner: 'Shit',
            },
            {
              taskId: 'task-1',
              taskName: 'Task 2',
              taskDescription: 'Task 2 Description',
              taskOwner: 'Shit',
            },
          ],
        },
        {
          listId: 'lists-1',
          listName: 'List 2',
          tasks: [
            {
              taskId: 'task-2',
              taskName: 'Task 3',
              taskDescription: 'Task 3 Description',
              taskOwner: 'Shit',
            },
          ],
        },
      ],
    },
  ],
};

const boardsSlice = createSlice({
  name: 'boards',
  initialState: initialState,
  reducers: {},
});

export const boardsReducer = boardsSlice.reducer;
