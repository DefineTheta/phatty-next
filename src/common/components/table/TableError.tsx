import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Card from '../layout/Card';

type ITableErrorProps = {
  retry?: () => void;
};

const TableError = ({ retry }: ITableErrorProps) => {
  return (
    <Card>
      <div className="flex w-full flex-row items-start gap-x-12 border-2 border-red-700 border-opacity-40 bg-red-400 bg-opacity-40 px-20 pt-20 pb-30 text-text-200">
        <ExclamationCircleIcon className="mt-2 h-20 w-20" />
        <div className="flex flex-col gap-y-6 tracking-wide ">
          <span className="text-base font-bold">Oops something went wrong...</span>
          <span className="text-md font-medium">
            An error occured trying to fetch data for this table
            <a
              className="cursor-pointer rounded-full pl-6 text-md font-bold text-text-200 underline underline-offset-2"
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
