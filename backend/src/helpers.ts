/**
 * Returns the primary key of the model
 * Assumes the PK is only one column in the DB
 * If not it will return only the first column of the PKs.
 * @param model the model to get the PK from
 * @returns {string}
 */
function primaryKeyOf(model: any): string {
  return model.primaryKeyAttributes[0];
}

export { primaryKeyOf };
