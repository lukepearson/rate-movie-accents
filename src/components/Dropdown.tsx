import { useCombobox } from 'downshift';
import { FC } from 'react';

interface DropdownItem {
  id: string;
  value: string;
}

interface DropdownProps {
  items: DropdownItem[];
  searchTerm: string;
  label: string;
  id: string;
  setSearchTerm: (value: string) => void;
  onSelect: (value: DropdownItem) => void;
  disabled?: boolean;
}

const Dropdown: FC<DropdownProps> = ({ items, searchTerm, setSearchTerm, onSelect, disabled, id, label }) => {

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items,
    onSelectedItemChange: ({ selectedItem }) => {
      onSelect(selectedItem);
      console.log(selectedItem);
    },
  });

  const displayOpen = isOpen && items.length > 0;

  return (
    <div className="relative">

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <input
          {...getInputProps()}
          className="input input-bordered input-primary w-full max-w-xs"
          value={searchTerm}
          id={`${id}-input`}
          disabled={disabled}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>
      
      <ul
        {...getMenuProps()}
        className={`absolute bg-gray-900 border border-gray-300 rounded-md w-full mt-1  ${
          displayOpen ? 'block z-10' : 'hidden'
        }`}
      >
        {displayOpen &&
          items.map((item, index) => (
            <li
              key={item.id}
              {...getItemProps({ item, index })}
              className={`cursor-pointer px-4 py-2 ${
                highlightedIndex === index ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {item.value}
            </li>
          ))}
      </ul>
    </div>
  );
}

export { Dropdown };
export type { DropdownItem };
