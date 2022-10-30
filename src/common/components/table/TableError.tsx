import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Card from '../layout/Card';

type ITableErrorProps = {
  retry?: () => void;
};

const TableError = ({ retry }: ITableErrorProps) => {
  return (
    <Card>
      <div className="w-full px-20 pt-20 pb-30 flex flex-row items-start gap-x-12 text-text-200 border-2 border-red-700 bg-red-400 bg-opacity-40 border-opacity-40">
        <ExclamationCircleIcon className="w-20 h-20 mt-2" />
        <div className="flex flex-col gap-y-6 tracking-wide ">
          <span className="text-base font-bold">Oops something went wrong...</span>
          <span className="text-md font-medium">
            An error occured trying to fetch data for this table
            <a
              className="pl-6 text-md font-bold underline underline-offset-2 text-text-200 rounded-full cursor-pointer"
              onClick={retry}
            >
              Retry?
            </a>
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TableError;
