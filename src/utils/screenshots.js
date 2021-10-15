import _ from "lodash";
import baseColors from "../../properties/colors/base.json";

export const colors = [
  baseColors.base["green-2"].value,
  baseColors.base["orange-1"].value,
  baseColors.base["red"].value,
  baseColors.base["blue-1"].value,
  baseColors.base["tan-1"].value
];

export const getOrigins = (width, height) => {
  const randomSpots = _.times(5, (d) => {
    const pixelSize = 15;
    const x = _.random(pixelSize, Math.floor(width / pixelSize) - 1);
    const y = _.random(pixelSize, Math.floor(height / pixelSize) - 1);
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
      { x: widthAvailable * (4 / 5) - imageSpace, y: height / 5 - imageSpace },
      { x: widthAvailable / 2 - imageSpace, y: height / 2 - imageSpace },
      { x: widthAvailable / 5 - imageSpace, y: height * (4 / 5) - imageSpace },
      { x: widthAvailable * (4 / 5) - imageSpace + 50, y: height * (4 / 5) - imageSpace - 50 }
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
