import Spinner from "../../../../components/Spinner"
import { useFetchMe } from "../../../../hooks/useAuth"
import Student from "./Student"
import Teacher from "./Teacher"

export const Main = () => {
    const {data,isPending} = useFetchMe()
    if(isPending){
        return <Spinner/>
    }
  return (
    data.role === 'student'?<Student/> : <Teacher/>
  )
}
