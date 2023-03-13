// A helper function to assert the request ID param is valid
// and convert it to a number (since it comes as a string by default)
function getIdParam(req: any): number {
  const id = req.params.id;
  if (/^\d+$/.test(id)) {
    return Number.parseInt(id, 10);
  }
  throw new TypeError(`Invalid ':id' param: "${id}"`);
}

export { getIdParam };
