import { ReactNode } from 'react';

export type ICardProps = {
  id?: string;
  children?: ReactNode;
};

const Card = ({ id, children }: ICardProps) => {
  return (
    <div id={id} className="w-full max-w-96 rounded-lg bg-background-300 py-24 px-20 shadow-md">
      {children}
    </div>
  );
};

export default Card;
