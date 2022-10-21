import { ReactNode } from 'react';

export type ICardProps = {
  children: ReactNode;
}

const Card = ({ children }: ICardProps) => {
  return (
    <div className='w-full max-w-96 py-24 px-20 bg-background-300 rounded-lg shadow-md'>
      {children}
    </div>
  )
}

export default Card;