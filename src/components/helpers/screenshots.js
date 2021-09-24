export const getOrigins = (key) => {
  if (key === "original-memes") {
    return [
      { x: 300, y: 200 },
      { x: 534, y: 67 },
      { x: 199, y: 600 },
      { x: 111, y: 45 },
      { x: 56, y: 230 }
    ];
  }
};

export const getDestinations = (key) => {
  if (key === "original-memes") {
    return [
      { x: 100, y: 100 },
      { x: 600, y: 50 },
      { x: 350, y: 350 },
      { x: 20, y: 600 },
      { x: 650, y: 650 }
    ];
  }
};

export const getLabels = (key) => {
  if (key === "original-memes") {
    return [
      "Grumpy cat",
      "These are all cakes",
      "Disaster girl",
      "Bernie's mittens",
      "Oregon Trail"
    ];
  } else if (key === "five-lennas") {
    return ["Lenna 1", "Lenna 2", "Lenna 3", "Lenna 4", "Lenna 5"];
  }
};
