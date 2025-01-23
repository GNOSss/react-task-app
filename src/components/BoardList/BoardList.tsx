import React, { FC, useState } from 'react';
import { useTypedDispatch, useTypedSelector } from '../../hooks/redux';
import SideForm from './SideForm/SideForm';
import { FiPlusCircle, FiLogIn } from 'react-icons/fi';
import { addButton, addSection, boardItemActive, container, title, boardItem } from './BoardList.css';
import clsx from 'clsx';
import { useRef } from 'react';
import { GoSignOut } from 'react-icons/go';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../../firebase';
import { removeUser, setUser } from '../../store/slices/userSlice';
import { useAuth } from '../../hooks/useAuth';

type TBoardListProps = {
  activeBoardId: string;
  setActiveBoardId: React.Dispatch<React.SetStateAction<string>>;
};

const BoardList: FC<TBoardListProps> = ({ activeBoardId, setActiveBoardId }) => {
  const dispatch = useTypedDispatch();
  const { boardArray } = useTypedSelector((state) => state.boards);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const { isAuth, displayName } = useAuth();
  console.log('displayName : ', displayName);
  console.log('isAuth : ', isAuth);

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        console.log(userCredential);
        dispatch(
          setUser({
            email: userCredential.user.email,
            id: userCredential.user.uid,
            displayName: userCredential.user.displayName,
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(removeUser());
        alert('User signed out');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClick = () => {
    setIsFormOpen(!isFormOpen);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className={container}>
      <div className={title}>게시판 :</div>

      {boardArray.map((board, index) => (
        <div
          key={board.boardId}
          onClick={() => setActiveBoardId(boardArray[index].boardId)}
          className={clsx(
            {
              [boardItemActive]: boardArray.findIndex((board) => board.boardId === activeBoardId) === index,
            },
            {
              [boardItem]: boardArray.findIndex((b) => b.boardId === activeBoardId) !== index,
            }
          )}
        >
          <div>{board.boardName}</div>
        </div>
      ))}
      <div className={addSection}>
        {isFormOpen ? <SideForm inputRef={inputRef} setIsFormOpen={setIsFormOpen} /> : <FiPlusCircle className={addButton} onClick={handleClick} />}
        {isAuth ? <GoSignOut className={addButton} onClick={handleSignOut} /> : <FiLogIn className={addButton} onClick={handleLogin} />}
      </div>
    </div>
  );
};

export default BoardList;
