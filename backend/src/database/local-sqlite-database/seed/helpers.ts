function pickRandom(args: string | any[]): any {
  return args[Math.floor(Math.random() * args.length)];
}

// function randomDate(): Date {
//   return new Date(new Date() - 200000000000 * Math.random());
// }

export {
  pickRandom,
  // randomDate,
};
