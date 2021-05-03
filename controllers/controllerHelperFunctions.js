exports.inDatabase = async (model, field, value) => {
  const exists = await model.where(field, `${value}`);
  return exists.length;
};
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

// if (req.body.students.length > 0) {
//   for await (const yeargroups of req.body.students.map((student) => ({
//     year: YearGroup.find({ students: student }),
//     student: student,
//   }))) {
//     let tempYear = await yeargroups.year;
//     tempYear.length > 0 ? null : temp.students.push(yeargroups.student);
//   }
// }
