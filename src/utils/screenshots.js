import _ from "lodash";
import baseColors from "$data/variables.json";

export const colors = [
  baseColors.base["orange-2"],
  baseColors.base["orange-1"],
  baseColors.base["red"],
  baseColors.base["blue-1"],
  baseColors.base["tan-1"]
];

export const getOrigins = (width, height) => {
  const startX = width * 0.2;
  const endX = width * 0.4;
  const startY = height * 0.3;
  const endY = height * 0.7;

  const randomSpots = _.times(5, (d) => {
    const pixelSize = 15;
    const x = _.random(Math.floor(startX / pixelSize), Math.floor(endX / pixelSize));
    const y = _.random(Math.floor(startY / pixelSize), Math.floor(endY / pixelSize));
    return { x: x * pixelSize - 3.5, y: y * pixelSize - 2 };
  });
  return randomSpots;
};

export const getDestinations = (key, width, height, finalSize) => {
  const type = key.split("-")[0];
  const i = parseInt(key.split("-")[1]);

  const widthAvailable = width * 0.7;
  const imageSpace = finalSize / 2;

  if (type === "memes" && i === 0) {
    return [
      { x: widthAvailable / 5 - imageSpace + 50, y: height / 5 - imageSpace - 50 },
      { x: widthAvailable * (4 / 5) - imageSpace / 2, y: height / 5 - imageSpace },
      { x: widthAvailable / 2 - imageSpace / 2, y: height / 2 - imageSpace },
      { x: widthAvailable / 5 - imageSpace / 2, y: height * (4 / 5) - imageSpace },
      { x: widthAvailable * (4 / 5) - imageSpace / 2 + 50, y: height * (4 / 5) - imageSpace - 50 }
    ];
  } else if (type === "memes") {
    return [...new Array(5).keys()].map((d) => ({
      x: _.random(0, width * 0.8 - finalSize),
      y: _.random(0, height - finalSize)
    }));
  } else if (type === "lennas") {
    return [
      { x: widthAvailable / 5 - imageSpace, y: height / 5 - imageSpace },
      { x: widthAvailable * (4 / 5) - imageSpace + 50, y: height / 5 - imageSpace - 50 },
      { x: widthAvailable / 2 - imageSpace, y: height / 2 - imageSpace },
      { x: widthAvailable / 5 - imageSpace + 50, y: height * (4 / 5) - imageSpace - 50 },
      { x: widthAvailable * (4 / 5) - imageSpace, y: height * (4 / 5) - imageSpace }
    ];
  }
};

export const getLabels = (key) => {
  if (key.includes("memes")) {
    return [
      "Grumpy cat",
      "These are all cakes",
      "Disaster girl",
      "Bernie's mittens",
      "Oregon Trail"
    ];
  } else if (key === "lennas") {
    return ["GitHub", "JS", "Homework assignment", "Stack Overflow", "Quora"];
  }
};
