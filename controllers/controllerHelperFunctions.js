//Takes of model, field and value. Queries the field in the model for that value
exports.inDatabase = async (model, field, value) => {
  const exists = await model.where(field, `${value}`);
  return exists.length;
};

//Takes an array of students and checks each one against yeargroup model. Returns array of students who aren't in any yeargroups
exports.studentsInYearGroup = async function (students, model) {
  const obj = {
    students: [],
    err: false,
    message: null,
  };
  try {
    for await (const document of students.map((student) => ({
      year: model.find({ students: student }),
      student: student,
    }))) {
      let tempYear = await document.year;
      if (tempYear.length === 0) obj.students.push(document.student);
    }
  } catch (err) {
    obj.message = `${err}`;
    obj.err = true;
  }
  return obj;
};
