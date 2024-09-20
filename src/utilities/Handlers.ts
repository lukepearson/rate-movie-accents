
const preventBubbles = () => {
  return {
    onClick: (e: React.MouseEvent) => {
      // e.preventDefault();
      e.stopPropagation();
    }
  }
};

export {
  preventBubbles,
};