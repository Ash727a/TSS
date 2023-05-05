import { APIRequest } from '../../interfaces.js';

// A helper function to assert the request ID param is valid
// and convert it to a number (since it comes as a string by default)
const NUMBER_REGEX = /^\d+$/;
const UUIDV4_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
function getIdParam(req: APIRequest): number {
  const id = req.params.id;
  if (NUMBER_REGEX.test(id)) {
    return Number.parseInt(id, 10);
    // Check if the ID is a UUIDv4. If so, return as-is
  } else if (UUIDV4_REGEX.test(id)) {
    return id;
  }
  throw new TypeError(`Invalid ':id' param: "${id}"`);
}

export { getIdParam };
