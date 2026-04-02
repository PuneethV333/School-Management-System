import Spinner from "../../../components/Spinner";
import { useFetchMe } from "../../../hooks/useAuth";
import StudentExam from "./Student/StudentExam";
import TeacherExam from "./teacher/TeacherExam";

const Exam = () => {
  const { data: userData, isPending: loading } = useFetchMe();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>{userData?.role === "student" ? <StudentExam /> : <TeacherExam />}</div>
  );
};

export default Exam;
