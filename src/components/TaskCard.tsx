import { Task } from '../types';

interface Props {
  task: Task;
}
export const TaskCard = ({ task }: Props) => {
  return (
    <div className='bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grabbing'>
      TaskCard
    </div>
  );
};
