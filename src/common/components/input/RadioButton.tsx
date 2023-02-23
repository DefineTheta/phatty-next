import { ChangeEvent } from 'react';

type IRadioButtonProps = {
  id: string;
  label: string;
  name: string;
  value: string;
  isChecked?: boolean;
  selectHandler: (e: ChangeEvent<HTMLInputElement>) => void;
};

const RadioButton = ({ id, label, name, value, isChecked, selectHandler }: IRadioButtonProps) => {
  return (
    <label className="group flex w-full cursor-pointer flex-row items-center gap-x-16 rounded-lg border border-white/20 p-12 transition-colors duration-150 ease-in-out hover:border-purple-200/60 [&:has(:checked)]:border-purple-400/80">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        className="peer accent-purple-400 checked:bg-purple-400"
        onChange={selectHandler}
      />
      <span className="text-md peer-checked:text-purple-400">{label}</span>
    </label>
  );
};

export default RadioButton;
