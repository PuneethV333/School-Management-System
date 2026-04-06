import Spinner from "../../../../components/Spinner";
import { useFetchMe } from "../../../../hooks/useAuth";
import Student from "./Students";
import Teacher from "./Teacher";

export const Main = () => {
  const { data: userData, isPending: loading } = useFetchMe();

  if (loading) {
    return <Spinner />;
  }
  return userData.role === "student" ? <Student /> : <Teacher />;
};
