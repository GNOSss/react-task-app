import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IBoard, IList, ITask } from '../../types';

type TBoardsState = {
  modalActive: boolean;
  boardArray: IBoard[];
};

type TAddBoardAction = {
  board: IBoard;
};

type TDeleteListAction = {
  boardId: string;
  listId: string;
};

type TAddListAction = {
  boardId: string;
  list: IList;
};

type TAddTaskAction = {
  boardId: string;
  listId: string;
  task: ITask;
};

type TDeleteTaskAction = {
  boardId: string;
  listId: string;
  taskId: string;
};

type TDeleteBoardAction = {
  boardId: string;
};

type TSortAction = {
  boardIndex: number;
  droppableIdStart: string;
  droppableIdEnd: string;
  droppableIndexStart: number;
  droppableIndexEnd: number;
  draggableId: string;
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
  reducers: {
    addBoard: (state, { payload }: PayloadAction<TAddBoardAction>) => {
      state.boardArray.push(payload.board);
    },

    deleteBoard: (state, { payload }: PayloadAction<TDeleteBoardAction>) => {
      state.boardArray = state.boardArray.filter((board) => board.boardId !== payload.boardId);
    },

    addList: (state, { payload }: PayloadAction<TAddListAction>) => {
      state.boardArray.map((board) => (board.boardId === payload.boardId ? { ...board, lists: board.lists.push(payload.list) } : board));
    },

    addTask: (state, { payload }: PayloadAction<TAddTaskAction>) => {
      state.boardArray.map((board) =>
        board.boardId === payload.boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.listId === payload.listId
                  ? {
                      ...list,
                      tasks: list.tasks.push(payload.task),
                    }
                  : list
              ),
            }
          : board
      );
    },

    updateTask: (state, { payload }: PayloadAction<TAddTaskAction>) => {
      state.boardArray = state.boardArray.map((board) =>
        board.boardId === payload.boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.listId === payload.listId
                  ? { ...list, tasks: list.tasks.map((task) => (task.taskId === payload.task.taskId ? payload.task : task)) }
                  : list
              ),
            }
          : board
      );
    },

    deleteTask: (state, { payload }: PayloadAction<TDeleteTaskAction>) => {
      state.boardArray = state.boardArray.map((board) =>
        board.boardId === payload.boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.listId === payload.listId ? { ...list, tasks: list.tasks.filter((task) => task.taskId !== payload.taskId) } : list
              ),
            }
          : board
      );
    },

    deleteList: (state, { payload }: PayloadAction<TDeleteListAction>) => {
      state.boardArray = state.boardArray.map((board) =>
        board.boardId === payload.boardId
          ? {
              ...board,
              lists: board.lists.filter((list) => list.listId !== payload.listId),
            }
          : board
      );
    },
    setModalActive: (state, { payload }: PayloadAction<boolean>) => {
      state.modalActive = payload;
    },
    // sort: (state, { payload }: PayloadAction<TSortAction>) => {
    //   // 같은 리스트 구역안에 있을때
    //   if (payload.droppableIdStart === payload.droppableIdEnd) {
    //     const list = state.boardArray[payload.boardIndex].lists.find((list) => list.listId === payload.droppableIdStart);

    //     // 변경시키려는 아이템을 배열에서 지워줍니다.
    //     // return 값으로 지워진 아이템을 잡아줍니다.
    //     const card = list?.tasks.splice(payload.droppableIndexStart, 1);

    //     list?.tasks.splice(payload.droppableIndexEnd, 0, ...card!);

    //     if (payload.droppableIdStart !== payload.droppableIdEnd) {
    //       const listStart = state.boardArray[payload.boardIndex].lists.find((list) => list.listId === payload.droppableIdStart);

    //       const card = listStart!.tasks.splice(payload.droppableIndexStart, 1);

    //       const listEnd = state.boardArray[payload.boardIndex].lists.find((list) => list.listId === payload.droppableIdEnd);
    //       listEnd?.tasks.splice(payload.droppableIndexEnd, 0, ...card!);
    //     }
    //   }
    // },
    sort: (state, { payload }: PayloadAction<TSortAction>) => {
      const { boardIndex, droppableIdStart, droppableIdEnd, droppableIndexStart, droppableIndexEnd } = payload;

      const board = state.boardArray[boardIndex];

      // 같은 리스트 내에서 이동
      if (droppableIdStart === droppableIdEnd) {
        const list = board.lists.find((list) => list.listId === droppableIdStart);

        if (list) {
          const [movedTask] = list.tasks.splice(droppableIndexStart, 1);
          list.tasks.splice(droppableIndexEnd, 0, movedTask);
        }
      } else {
        // 다른 리스트로 이동
        const listStart = board.lists.find((list) => list.listId === droppableIdStart);
        const listEnd = board.lists.find((list) => list.listId === droppableIdEnd);

        if (listStart && listEnd) {
          // 이동할 항목 제거
          const [movedTask] = listStart.tasks.splice(droppableIndexStart, 1);

          // 새 리스트에 항목 추가
          listEnd.tasks.splice(droppableIndexEnd, 0, movedTask);
        }
      }
    },
  },
});

export const { sort, addBoard, deleteBoard, deleteList, setModalActive, addList, addTask, updateTask, deleteTask } = boardsSlice.actions;
export const boardsReducer = boardsSlice.reducer;
