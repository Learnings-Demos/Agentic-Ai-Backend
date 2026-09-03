import { decode, encode } from "@toon-format/toon";

/* -------------------------------------------------------------------------- */
/*                                Encode Toon                                 */
/* -------------------------------------------------------------------------- */
export const encodeToon = (data: any) => {
  return encode(data);
};

/* -------------------------------------------------------------------------- */
/*                                Decode Toon                                 */
/* -------------------------------------------------------------------------- */
export const decodeToon = (data: any) => {
  return decode(data);
};

console.log(encodeToon([
  "The quick brown fox jumps over the lazy dog while the sun sets behind the mountains casting golden hues",
  "Artificial intelligence is transforming the way we live and work by automating repetitive tasks and enhancing human creativity",
  "In a world full of endless possibilities the only limit is your imagination and the courage to pursue your dreams",
  "React is a powerful JavaScript library for building user interfaces that are fast interactive and highly maintainable",
  "The ocean waves crashed against the rocky shore as seagulls soared overhead searching for their evening meal along the coastline",
  "TypeScript brings static typing to JavaScript helping developers catch errors early and write more robust scalable applications",
  "Every morning the city comes alive with the sounds of traffic people rushing to work and coffee shops opening their doors",
  "Machine learning models require large amounts of clean labeled data to train effectively and produce accurate reliable predictions",
  "The ancient library held thousands of manuscripts each containing wisdom passed down through generations of scholars and philosophers",
  "Node.js enables server-side JavaScript execution allowing developers to build fast scalable network applications with ease"
]))