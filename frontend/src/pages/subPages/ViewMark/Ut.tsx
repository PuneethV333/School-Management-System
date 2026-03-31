import Spinner from "../../../components/Spinner";
import { useFetchMe } from "../../../hooks/useAuth";
import StudentUt from "./Student/StudentUt";
import TeacherUt from "./teacher/TeacherUt";

const Ut = () => {
  const { data: userData, isPending: loading } = useFetchMe();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>{userData?.role === "student" ? <StudentUt /> : <TeacherUt />}</div>
  );
};

export default Ut;
