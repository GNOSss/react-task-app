import { appContainer, board, buttons, deleteBoardButton, loggerButton } from '../public/style/APP.css';
import BoardList from './components/BoardList/BoardList';
import { useState } from 'react';
import ListsContainer from './components/ListsContainer/ListsContainer';
import { useTypedDispatch, useTypedSelector } from './hooks/redux';
import EditModal from './components/EditModal/EditModal';
import LoggerModal from './components/LoggerModal/LoggerModal';
import { deleteBoard, sort } from './store/slices/boardsSlice';
import { v4 } from 'uuid';
import { addLog } from './store/slices/loggerSlice';
import { DragDropContext } from '@hello-pangea/dnd';

function App() {
  const dispatch = useTypedDispatch();
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [activeBoardId, setActiveBoardId] = useState('board-0');
  const modalActive = useTypedSelector((state) => state.boards.modalActive);
  const boards = useTypedSelector((state) => state.boards.boardArray);

  const getActiveBoard = boards.filter((board) => board.boardId === activeBoardId)[0];

  const lists = getActiveBoard.lists;

  const handleDeleteBoard = () => {
    if (boards.length > 1) {
      dispatch(deleteBoard({ boardId: getActiveBoard.boardId }));
      dispatch(
        addLog({
          logId: v4(),
          logMessage: `게시판 지우기: ${getActiveBoard.boardName}`,
          logAuthor: 'User',
          logTimestamp: String(Date.now()),
        })
      );
      const newIndexToset = () => {
        const indexToBeDeleted = boards.findIndex((board) => board.boardId === activeBoardId);
        return indexToBeDeleted === 0 ? indexToBeDeleted + 1 : indexToBeDeleted - 1;
      };

      setActiveBoardId(boards[newIndexToset()].boardId);
    } else {
      alert('최소 게시판 개수는 한 개 입니다.');
    }
  };

  const handleDrageEnd = (reuslt: any) => {
    // 리스트 가져오기
    console.log('result : ', reuslt);
    const { destination, source, draggableId } = reuslt;
    // 각 리스트의 세부 목록
    console.log('lists : ', lists);
    // 선택한 리스트 세부 목록
    const sourceList = lists.filter((list) => list.listId === source.droppableId)[0];
    console.log('source list : ', sourceList);

    dispatch(
      sort({
        boardIndex: boards.findIndex((board) => board.boardId === activeBoardId),
        droppableIdStart: source.droppableId,
        droppableIdEnd: destination.droppableId,
        droppableIndexStart: source.index,
        droppableIndexEnd: destination.index,
        draggableId: draggableId,
      })
    );

    // // Create log data
    // const logData = {
    //   logId: v4(),
    //   logMessage: `리스트: ${sourceList.listName} -> ${lists.find((list) => list.listId === destination.droppableId)?.listName}으로 ${
    //     sourceList.tasks.find((task) => task.taskId === draggableId)?.taskName
    //   }을 옮김`,
    //   logAuthor: 'User',
    //   logTimestamp: String(Date.now()),
    // };
    // console.log('Dispatching addLog:', logData);

    dispatch(
      addLog({
        logId: v4(),
        logMessage: `리스트: ${sourceList.listName} -> ${lists.filter((list) => list.listId === destination.droppableId)[0].listName}으로 
        ${sourceList.tasks.filter((task) => task.taskId === draggableId)[0].taskName}을 옮김`,
        logAuthor: 'User',
        logTimestamp: String(Date.now()),
      })
    );
  };

  return (
    <div className={appContainer}>
      {isLoggerOpen ? <LoggerModal setIsLoggerOpen={setIsLoggerOpen} /> : null}
      {modalActive ? <EditModal /> : null}
      <BoardList activeBoardId={activeBoardId} setActiveBoardId={setActiveBoardId} />
      <div className={board}>
        <DragDropContext onDragEnd={handleDrageEnd}>
          <ListsContainer lists={lists} boardId={getActiveBoard.boardId} />
        </DragDropContext>
      </div>
      <div className={buttons}>
        <button className={deleteBoardButton} onClick={handleDeleteBoard}>
          이 게시판 삭제하기
        </button>
        <button className={loggerButton} onClick={() => setIsLoggerOpen(!isLoggerOpen)}>
          {isLoggerOpen ? '활동 목록 숨기기' : '활동 목록 보이기'}
        </button>
      </div>
    </div>
  );
}

export default App;
