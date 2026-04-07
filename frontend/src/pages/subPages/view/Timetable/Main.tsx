import Spinner from "../../../../components/Spinner"
import { useFetchMe } from "../../../../hooks/useAuth"
import { Student } from "./Student"
import { Teacher } from "./Teacher"

export const Main = () => {
    const {data:userData,isPending} = useFetchMe()
    
    if(isPending){
        return <Spinner/>
    }
    
  return (
    userData.role === 'student' ? <Student/> : <Teacher/>
  )
}
