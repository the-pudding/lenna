import _ from "lodash";
import baseColors from "../../../properties/colors/base.json";

export const colors = [
  baseColors.base["green-2"].value,
  baseColors.base["orange-1"].value,
  baseColors.base["red"].value,
  baseColors.base["blue-1"].value,
  baseColors.base["tan-1"].value
];

export const getOrigins = (key, width, height, finalSize) => {
  const type = key.split("-")[0];
  const i = parseInt(key.split("-")[1]);

  if (type === "memes" && i === 0) {
    return [
      { x: 300, y: 200 },
      { x: 534, y: 67 },
      { x: 199, y: 600 },
      { x: 111, y: 45 },
      { x: 56, y: 230 }
    ];
  } else if (type === "memes" || type === "lennas") {
    return [...new Array(5).keys()].map((d) => ({
      x: _.random(0, width - finalSize),
      y: _.random(0, height - finalSize)
    }));
  }
};

export const getDestinations = (key, width, height, finalSize) => {
  const type = key.split("-")[0];
  const i = parseInt(key.split("-")[1]);

  if (type === "memes" && i === 0) {
    return [
      { x: 100, y: 100 },
      { x: 600, y: 50 },
      { x: 350, y: 350 },
      { x: 20, y: 600 },
      { x: 650, y: 650 }
    ];
  } else if (type === "memes" || type === "lennas") {
    return [...new Array(5).keys()].map((d) => ({
      x: _.random(0, width - finalSize),
      y: _.random(0, height - finalSize)
    }));
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
    return ["Lenna 1", "Lenna 2", "Lenna 3", "Lenna 4", "Lenna 5"];
  }
};
