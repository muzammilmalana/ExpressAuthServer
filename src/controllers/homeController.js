const items = [
  { id: 1, name: "Item 1", description: "This is item 1" },
  { id: 2, name: "Item 2", description: "This is item 2" },
  { id: 3, name: "Item 3", description: "This is item 3" },
];

const getItems = (req, res) => {
  res.status(200).json(items);
};

// Exporting as an object
module.exports = {
  getItems,
};
