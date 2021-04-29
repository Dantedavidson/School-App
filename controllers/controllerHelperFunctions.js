exports.inDatabase = async (model, field, value) => {
  const exists = await model.where(field, `${value}`);
  return exists.length;
};
