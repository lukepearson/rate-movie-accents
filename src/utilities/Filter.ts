
const filterBy = <T>(term: string, key: keyof T) => {
  return (item: T) => {
    return String(item[key]).toLowerCase().includes(term.toLowerCase());
  }
};

export { filterBy };