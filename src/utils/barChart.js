import _ from "lodash";
import raw from "$data/data.csv";

export const barChartData = () => {
  const counts = raw
    .filter((d) => d.year)
    .reduce((acc, currentValue) => {
      const year = parseInt(currentValue.year);
      const existing = acc.filter((d) => d.year === year);
      if (existing.length) {
        return [...acc.filter((d) => d.year !== year), { year, value: existing[0].value + 1 }];
      }
      return [...acc, { year, value: 1 }];
    }, []);
  const sorted = _.sortBy(counts, (d) => d.year);

  return sorted;
};

export const showUntilYear = (step) => {
  if (step === 6) return 0;
  if (step === 7) return 1991;
  return 2022;
};
