import { FC } from 'react';
import { IList } from '../../types';
import List from '../List/List';
import ActionButton from '../ActionButton/ActionButton';
import { listsContainer } from './ListsContainer.css';

type TListsContainerProps = {
  boardId: string;
  lists: IList[];
};

const ListsContainer: FC<TListsContainerProps> = ({ lists, boardId }) => {
  return (
    <div className={listsContainer}>
      {lists.map((list) => (
        <List
          key={list.listId}
          list={list}
          boardId={boardId} // pass boardId to List component for task filtering
        />
      ))}
      <ActionButton boardId={boardId} listId={''} list />
    </div>
  );
};

export default ListsContainer;
