import clsx from 'clsx';
import { useCombobox } from 'downshift';
import { FC } from 'react';
import Film from '@heroicons/react/24/outline/FilmIcon';
import User from '@heroicons/react/24/outline/UserIcon';

interface DropdownItem {
  id: string;
  value: string;
  type: 'actor' | 'film';
}

interface DropdownProps {
  items: DropdownItem[];
  searchTerm: string;
  label: string;
  id: string;
  setSearchTerm: (value: string) => void;
  onSelect: (value: DropdownItem) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

const Dropdown: FC<DropdownProps> = ({ items, searchTerm, setSearchTerm, onSelect, disabled, autoFocus, id, label }) => {

  const {
    isOpen,
    openMenu,
    getMenuProps,
    getInputProps,
    getItemProps,
    selectedItem,
    highlightedIndex,
    setHighlightedIndex,
  } = useCombobox({
    items,
    onSelectedItemChange: ({ selectedItem }) => {
      onSelect(selectedItem);
    },
  });

  const displayOpen = isOpen && items.length > 0;

  return (
    <div className="max-w-full w-full">
      <label className="form-control">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <input
          {...getInputProps()}
          className="input input-bordered input-primary"
          value={searchTerm}
          id={`${id}-input`}
          disabled={disabled}
          autoFocus={autoFocus}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && highlightedIndex !== -1 && searchTerm.length) {
              onSelect(items[highlightedIndex || 0]);
            }
            if (e.key === 'Down' || e.key === 'ArrowDown') {
              e.preventDefault();
              setHighlightedIndex(highlightedIndex === null ? 0 : highlightedIndex + 1);
            }
            if (e.key === 'Up' || e.key === 'ArrowUp') {
              e.preventDefault();
              setHighlightedIndex(highlightedIndex === null ? 0 : highlightedIndex - 1);
            }
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            if (!isOpen) {
              openMenu();
            }
          }}
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
              className={clsx(`cursor-pointer px-4 py-2 ${
                highlightedIndex === index ? 'bg-blue-500 text-white' : ''
              }`, item.type === 'actor' ? 'text-green-500' : 'text-blue-500')}
            >
              <span>
                {item.type === 'actor' ? <User className='inline h-6 w-6 pe-2' /> : <Film className="inline h-6 w-6 pe-2" />}
                {item.value}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export { Dropdown };
export type { DropdownItem };

