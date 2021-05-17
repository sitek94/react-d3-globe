export type Color = string;

export interface Colors {
  countryColor: Color;
  countryHoverColor: Color;
  oceanColor: Color;
}

function createScheme(
  countryColor: Color,
  countryHoverColor: Color,
  oceanColor: Color
): Colors {
  return {
    countryColor,
    countryHoverColor,
    oceanColor,
  };
}

export const earth = createScheme('lightgreen', 'limegreen', 'dodgerblue');

export const orange = createScheme('darkorange', 'orangered', 'moccasin');

export const purple = createScheme('blueviolet', 'purple', 'plum');

export const blue = createScheme('dodgerblue', 'royalblue', 'lightblue');

export const light = createScheme('#444', '#222', '#eee');

export const dark = createScheme('#eee', '#aaa', '#444');
