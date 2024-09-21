import { useRef } from "react";

const useDebounce = () => {
  const entries = useRef<Array<string>>([]);

  const setValue = (newValue: string) => {
    entries.current.push(newValue);
  }

};

export { useDebounce };