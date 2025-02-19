import {bigIntToIndex} from '../quadbin-utils';

export type IndexScheme = 'h3' | 'quadbin';
type TypedArray = Float32Array | Float64Array;

export type Indices = {value: BigUint64Array};
export type NumericProps = Record<string, {value: number[] | TypedArray}>;
export type Properties = Record<string, string | number | boolean | null>;
export type Cells = {
  indices: Indices;
  numericProps: NumericProps;
  properties: Properties[];
};
export type SpatialBinary = {scheme?: IndexScheme; cells: Cells};
export type SpatialJson = {
  id: string;
  properties: Properties;
}[];

export function binaryToSpatialjson(binary: SpatialBinary): SpatialJson {
  const {cells} = binary;
  const count = cells.indices.value.length;
  const spatial: any[] = [];
  for (let i = 0; i < count; i++) {
    const id = bigIntToIndex(cells.indices.value[i]);

    const properties = {...cells.properties[i]};
    for (const key of Object.keys(cells.numericProps)) {
      properties[key] = cells.numericProps[key].value[i];
    }
    spatial.push({id, properties});
  }

  return spatial;
}
