const completedTo = (task) => {
  task.completed = true;
};

const incompleteTo = (task) => {
  task.completed = false;
};

export { completedTo, incompleteTo };
